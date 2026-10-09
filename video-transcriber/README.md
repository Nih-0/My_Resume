# 🎬 Multilingual Video Transcriber (Spring Boot + FFmpeg + AI Whisper)

A full-stack Spring Boot web application with an interactive frontend that allows you to upload videos containing multi-language audio tracks (**English**, **Hindi**, **Tamil**, etc.), inspect/extract individual audio streams with **FFmpeg**, and generate speech-to-text transcriptions with timestamps, SRT subtitles, and live interactive video synchronization.

---

## 🌟 Features

1. **FFmpeg Multi-Stream Audio Inspector & Extractor**:
   - Integrates with your local FFmpeg (`ffmpeg.exe` & `ffprobe.exe`).
   - Automatically probes media files to discover video resolution, codecs, and all embedded audio streams (English, Hindi, Tamil, etc.).
   - Extracts and normalizes audio streams to 16kHz mono WAV format (`pcm_s16le`) optimized for speech recognition.
   - Allows previewing and listening to each isolated audio track directly from the browser.

2. **Multilingual Speech-to-Text (AI Whisper)**:
   - Powered by `faster-whisper` (CTranslate2) running 4x faster on CPU/GPU.
   - Dedicated high-accuracy language tuning for:
     - 🇬🇧 **English (`en`)**
     - 🇮🇳 **Hindi (`hi` / हिन्दी)**
     - 🇮🇳 **Tamil (`ta` / தமிழ்)**
     - 🌐 **Auto-Detect (`auto`)**
   - Batch Transcribe Mode: Transcribe all language tracks simultaneously in one click.

3. **Synchronized Video Player & Live Interactive Transcript**:
   - Play the uploaded video while live subtitle highlights track the speaker in real time.
   - Click any timestamp or word segment to jump the video directly to that exact second.
   - Full-text search to find words across the spoken dialog.

4. **Multi-Format Exporting**:
   - 📥 **SRT** (SubRip Subtitle format for YouTube/VLC/Premiere)
   - 📥 **VTT** (WebVTT format for HTML5 video players)
   - 📥 **TXT** (Clean plain text transcript)
   - 📥 **JSON** (Complete timestamped segments & word timings)
   - 📋 **One-Click Copy** to clipboard

---

## 🚀 Quick Start

### 1. Launch the Application
Double-click `run.bat` or run in terminal:

```powershell
cd c:\Users\Nihal\Desktop\own_projs\portfolio\video-transcriber
java -jar target\video-transcriber-1.0.0.jar
```
Or start via Maven:
```powershell
mvn spring-boot:run
```

### 2. Open in Browser
Visit **[http://localhost:8080/](http://localhost:8080/)** in your browser.

---

## ⚙️ Configuration (`src/main/resources/application.properties`)

```properties
server.port=8080

# FFmpeg & FFprobe Binary Paths
app.ffmpeg.path=C:/Users/Nihal/Downloads/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/bin/ffmpeg.exe
app.ffprobe.path=C:/Users/Nihal/Downloads/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/bin/ffprobe.exe

# Storage directories
app.storage.uploads-dir=./storage/uploads
app.storage.extracted-dir=./storage/extracted
app.storage.transcripts-dir=./storage/transcripts
```

*Note: You can also update the FFmpeg paths on the fly via the ⚙️ Settings modal in the web UI.*

---

## 🛠️ API Endpoints

- `POST /api/media/upload`: Upload video and inspect audio streams via FFprobe.
- `GET /api/media/stream/{fileId}`: Video stream with HTTP 206 Partial Content (smooth seeking).
- `GET /api/media/audio/{fileId}/{streamIndex}`: Isolated audio track stream.
- `POST /api/media/transcribe`: Transcribe a single audio track with selected language and model.
- `POST /api/media/transcribe-all`: Batch transcribe all language tracks (English + Hindi + Tamil).
- `GET /api/media/export/{fileId}/{format}`: Download transcript in `.srt`, `.vtt`, `.txt`, or `.json`.
- `GET /api/system/status`: Check FFmpeg and AI engine health.
