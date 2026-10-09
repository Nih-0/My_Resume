"""
High-Speed Multilingual Video & Audio Transcriber
Supports English, Hindi, Tamil, and auto-detection with High-Accuracy Prompt Tuning.
Uses faster-whisper (CTranslate2) with fallback to OpenAI API.
"""

import sys
import os
import io
import json
import argparse
import time
import wave
import numpy as np

# Ensure UTF-8 output on Windows consoles
os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["PYTHONUTF8"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# High-accuracy context prompts for Indian multilingual / code-switched speech
LANGUAGE_PROMPTS = {
    "ta": "வணக்கம், இந்த வீடியோவில் monthly SIP, 5000 rupees, Mutual Funds, Asset Allocation, Large Cap, Mid Cap, Small Cap, Multi Cap, Gold, Wealth With Kaushik, investment, returns, corpus, 1 crore பற்றி பேசுகிறார்.",
    "hi": "नमस्ते, इस वीडियो में monthly SIP, Mutual Funds, Asset Allocation, Large Cap, Mid Cap, Small Cap, Multi Cap, Gold, investment, returns, corpus, 1 crore के बारे में बात कर रहे हैं।",
    "en": "Hello, in this video we discuss monthly SIP, Mutual Funds, Asset Allocation, Large Cap, Mid Cap, Small Cap, Multi Cap, Gold, investment, returns, corpus, and finance."
}

def format_timestamp_srt(seconds: float) -> str:
    millis = int((seconds - int(seconds)) * 1000)
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def format_timestamp_vtt(seconds: float) -> str:
    millis = int((seconds - int(seconds)) * 1000)
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"

def load_audio_array(audio_path):
    """
    Loads 16kHz mono WAV directly into float32 numpy array [-1.0, 1.0]
    Bypasses PyAV av.open() incompatibility across Windows versions.
    """
    try:
        with wave.open(audio_path, 'rb') as wf:
            nchannels = wf.getnchannels()
            sampwidth = wf.getsampwidth()
            framerate = wf.getframerate()
            nframes = wf.getnframes()
            data = wf.readframes(nframes)

            if sampwidth == 2:
                audio_np = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
            elif sampwidth == 4:
                audio_np = np.frombuffer(data, dtype=np.int32).astype(np.float32) / 2147483648.0
            elif sampwidth == 1:
                audio_np = (np.frombuffer(data, dtype=np.uint8).astype(np.float32) - 128.0) / 128.0
            else:
                audio_np = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0

            # If stereo or multi-channel, average channels to mono
            if nchannels > 1:
                audio_np = audio_np.reshape(-1, nchannels).mean(axis=1)

            return audio_np
    except Exception as e:
        print(f"[Whisper] Direct WAV loading failed ({e}), falling back to file path", file=sys.stderr)
        return audio_path

def transcribe_local_whisper(audio_path, language, model_name="medium", device="cpu", compute_type="int8", word_timestamps=True, custom_prompt=None):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise RuntimeError("faster-whisper is not installed. Please install it via pip install faster-whisper")

    # Map language codes
    lang_code = language.strip().lower() if language else "auto"
    if lang_code in ["auto", "detect", "all", ""]:
        lang_code = None
    elif lang_code in ["english", "eng", "en"]:
        lang_code = "en"
    elif lang_code in ["hindi", "hin", "hi"]:
        lang_code = "hi"
    elif lang_code in ["tamil", "tam", "ta"]:
        lang_code = "ta"

    download_dir = os.path.join(os.path.expanduser("~"), ".cache", "whisper-models")
    model = None

    if device == "cuda":
        try:
            print(f"[Whisper] Initializing model '{model_name}' on CUDA...", file=sys.stderr)
            model = WhisperModel(model_name, device="cuda", compute_type="float16", download_root=download_dir)
        except Exception as e:
            print(f"[Whisper] CUDA not available or missing DLLs ({e}). Automatically falling back to CPU (int8)...", file=sys.stderr)
            device = "cpu"
            compute_type = "int8"

    if model is None:
        print(f"[Whisper] Initializing model '{model_name}' on device 'cpu' (compute: {compute_type})...", file=sys.stderr)
        model = WhisperModel(model_name, device="cpu", compute_type=compute_type, download_root=download_dir)

    # Load audio as numpy array to bypass PyAV av.open bugs
    audio_input = load_audio_array(audio_path)

    # Determine prompt for code-switching / multilingual accuracy
    initial_prompt = custom_prompt or (LANGUAGE_PROMPTS.get(lang_code) if lang_code else None)

    print(f"[Whisper] Transcribing with model '{model_name}', language: '{lang_code or 'auto-detect'}'...", file=sys.stderr)
    start_time = time.time()
    
    transcribe_params = {
        "language": lang_code,
        "task": "transcribe",
        "beam_size": 5,
        "word_timestamps": word_timestamps,
        "condition_on_previous_text": False,
        "compression_ratio_threshold": 2.4,
        "no_speech_threshold": 0.6,
        "vad_filter": True,
        "vad_parameters": dict(min_silence_duration_ms=400)
    }
    if initial_prompt:
        transcribe_params["initial_prompt"] = initial_prompt

    try:
        segments_iter, info = model.transcribe(audio_input, **transcribe_params)
    except Exception as e:
        if device == "cuda":
            print(f"[Whisper] CUDA transcribe error ({e}), retrying on CPU...", file=sys.stderr)
            model = WhisperModel(model_name, device="cpu", compute_type="int8", download_root=download_dir)
            segments_iter, info = model.transcribe(audio_input, **transcribe_params)
        else:
            raise e

    detected_language = info.language
    lang_probability = round(info.language_probability, 4)
    duration = round(info.duration, 2)

    segments = []
    full_text_parts = []
    srt_lines = []
    vtt_lines = ["WEBVTT\n"]

    seg_idx = 1
    for seg in segments_iter:
        seg_text = seg.text.strip()
        if not seg_text:
            continue
        
        words_list = []
        if hasattr(seg, 'words') and seg.words:
            for w in seg.words:
                words_list.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "probability": round(w.probability, 3)
                })

        segment_data = {
            "id": seg_idx,
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg_text,
            "words": words_list
        }
        segments.append(segment_data)
        full_text_parts.append(seg_text)

        # Build SRT
        srt_lines.append(f"{seg_idx}")
        srt_lines.append(f"{format_timestamp_srt(seg.start)} --> {format_timestamp_srt(seg.end)}")
        srt_lines.append(seg_text)
        srt_lines.append("")

        # Build VTT
        vtt_lines.append(f"{format_timestamp_vtt(seg.start)} --> {format_timestamp_vtt(seg.end)}")
        vtt_lines.append(seg_text)
        vtt_lines.append("")

        seg_idx += 1

    elapsed = round(time.time() - start_time, 2)
    full_text = " ".join(full_text_parts)

    return {
        "status": "SUCCESS",
        "language": detected_language,
        "language_name": get_language_display_name(detected_language),
        "language_probability": lang_probability,
        "duration_seconds": duration,
        "processing_time_seconds": elapsed,
        "model_used": f"faster-whisper-{model_name}",
        "full_text": full_text,
        "segments": segments,
        "srt_content": "\n".join(srt_lines),
        "vtt_content": "\n".join(vtt_lines)
    }

def transcribe_openai_api(audio_path, language, api_key):
    import openai
    client = openai.OpenAI(api_key=api_key)
    
    lang_code = language.strip().lower() if language else None
    if lang_code in ["auto", "detect", "all", ""]:
        lang_code = None
    elif lang_code in ["english", "eng", "en"]:
        lang_code = "en"
    elif lang_code in ["hindi", "hin", "hi"]:
        lang_code = "hi"
    elif lang_code in ["tamil", "tam", "ta"]:
        lang_code = "ta"

    with open(audio_path, "rb") as f:
        kwargs = {
            "model": "whisper-1",
            "file": f,
            "response_format": "verbose_json",
            "timestamp_granularities": ["segment", "word"]
        }
        if lang_code:
            kwargs["language"] = lang_code
            if lang_code in LANGUAGE_PROMPTS:
                kwargs["prompt"] = LANGUAGE_PROMPTS[lang_code]
        
        response = client.audio.transcriptions.create(**kwargs)
        res_dict = response.model_dump()

    segments = []
    srt_lines = []
    vtt_lines = ["WEBVTT\n"]
    seg_idx = 1
    for s in res_dict.get("segments", []):
        seg_text = s.get("text", "").strip()
        start = s.get("start", 0.0)
        end = s.get("end", 0.0)
        segments.append({
            "id": seg_idx,
            "start": round(start, 3),
            "end": round(end, 3),
            "text": seg_text,
            "words": s.get("words", [])
        })
        srt_lines.append(f"{seg_idx}")
        srt_lines.append(f"{format_timestamp_srt(start)} --> {format_timestamp_srt(end)}")
        srt_lines.append(seg_text)
        srt_lines.append("")

        vtt_lines.append(f"{format_timestamp_vtt(start)} --> {format_timestamp_vtt(end)}")
        vtt_lines.append(seg_text)
        vtt_lines.append("")
        seg_idx += 1

    return {
        "status": "SUCCESS",
        "language": res_dict.get("language", lang_code or "unknown"),
        "language_name": get_language_display_name(res_dict.get("language", lang_code or "unknown")),
        "language_probability": 1.0,
        "duration_seconds": round(res_dict.get("duration", 0.0), 2),
        "processing_time_seconds": 0.0,
        "model_used": "openai-whisper-1-api",
        "full_text": res_dict.get("text", ""),
        "segments": segments,
        "srt_content": "\n".join(srt_lines),
        "vtt_content": "\n".join(vtt_lines)
    }

def get_language_display_name(code):
    mapping = {
        "en": "English",
        "hi": "Hindi (हिन्दी)",
        "ta": "Tamil (தமிழ்)",
        "te": "Telugu (తెలుగు)",
        "kn": "Kannada (ಕನ್ನಡ)",
        "ml": "Malayalam (മലയാളം)",
        "mr": "Marathi (मराठी)",
        "bn": "Bengali (বাংলা)",
        "gu": "Gujarati (ગુજરાતી)",
        "pa": "Punjabi (ਪੰਜਾਬੀ)",
        "ur": "Urdu (اردو)",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
        "ar": "Arabic"
    }
    return mapping.get(str(code).lower(), str(code).capitalize())

def main():
    parser = argparse.ArgumentParser(description="Multi-lingual Audio/Video Transcriber")
    parser.add_argument("--audio", required=True, help="Path to input audio/video WAV file")
    parser.add_argument("--language", default="auto", help="Language: en, hi, ta, auto")
    parser.add_argument("--model", default="medium", help="Whisper model: tiny, base, small, medium, large-v3")
    parser.add_argument("--device", default="cpu", help="Device: cpu or cuda")
    parser.add_argument("--compute-type", default="int8", help="Compute type: int8, float32, float16")
    parser.add_argument("--output-json", help="Path to write output JSON file")
    parser.add_argument("--api-key", default="", help="OpenAI API Key for cloud Whisper fallback")
    parser.add_argument("--prompt", default="", help="Optional domain prompt")
    
    args = parser.parse_args()

    if not os.path.isfile(args.audio):
        err_res = {"status": "ERROR", "error": f"Audio file does not exist: {args.audio}"}
        print(json.dumps(err_res, ensure_ascii=False, indent=2))
        sys.exit(1)

    try:
        if args.api_key:
            res = transcribe_openai_api(args.audio, args.language, args.api_key)
        else:
            res = transcribe_local_whisper(
                audio_path=args.audio,
                language=args.language,
                model_name=args.model,
                device=args.device,
                compute_type=args.compute_type,
                custom_prompt=args.prompt if args.prompt else None
            )
        
        json_output = json.dumps(res, ensure_ascii=False, indent=2)
        if args.output_json:
            with open(args.output_json, "w", encoding="utf-8") as out_f:
                out_f.write(json_output)
        
        print(json_output)
    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        err_res = {"status": "ERROR", "error": str(e)}
        print(json.dumps(err_res, ensure_ascii=False, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
