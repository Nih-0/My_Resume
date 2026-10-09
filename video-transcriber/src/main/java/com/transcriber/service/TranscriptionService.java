package com.transcriber.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.transcriber.dto.TranscriptSegment;
import com.transcriber.dto.TranscriptionRequest;
import com.transcriber.dto.TranscriptionResponse;
import com.transcriber.dto.WordTiming;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Service
public class TranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(TranscriptionService.class);

    private final FFmpegService ffmpegService;
    private final StorageService storageService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.python.path:python}")
    private String pythonPath;

    @Value("${app.python.script:./python/transcribe.py}")
    private String pythonScriptPath;

    public TranscriptionService(FFmpegService ffmpegService, StorageService storageService) {
        this.ffmpegService = ffmpegService;
        this.storageService = storageService;
    }

    public TranscriptionResponse transcribe(TranscriptionRequest request) {
        String fileId = request.getFileId();
        Integer streamIndex = request.getStreamIndex();
        File videoFile = storageService.getUploadedFile(fileId);

        if (videoFile == null || !videoFile.exists()) {
            TranscriptionResponse err = new TranscriptionResponse();
            err.setStatus("ERROR");
            err.setError("Uploaded file not found for ID: " + fileId);
            return err;
        }

        try {
            // 1. Extract audio WAV via FFmpeg
            File wavFile = storageService.getExtractedAudioFile(fileId, streamIndex);
            if (!wavFile.exists() || wavFile.length() == 0) {
                log.info("Extracting audio with FFmpeg to {}", wavFile.getAbsolutePath());
                ffmpegService.extractAudioToWav(videoFile, wavFile, streamIndex);
            }

            // 2. Prepare Python transcribe command
            File scriptFile = new File(pythonScriptPath);
            if (!scriptFile.exists()) {
                scriptFile = new File("c:/Users/Nihal/Desktop/own_projs/portfolio/video-transcriber/python/transcribe.py");
            }
            String scriptAbsPath = scriptFile.getAbsolutePath();

            File outputJsonFile = storageService.getTranscriptJsonFile(fileId, streamIndex);

            List<String> cmd = new ArrayList<>();
            cmd.add(pythonPath);
            cmd.add(scriptAbsPath);
            cmd.add("--audio");
            cmd.add(wavFile.getAbsolutePath());
            cmd.add("--language");
            cmd.add(request.getLanguage() != null ? request.getLanguage() : "auto");
            cmd.add("--model");
            cmd.add(request.getModel() != null ? request.getModel() : "base");
            cmd.add("--device");
            cmd.add(request.getDevice() != null ? request.getDevice() : "cpu");
            cmd.add("--output-json");
            cmd.add(outputJsonFile.getAbsolutePath());

            if (request.getApiKey() != null && !request.getApiKey().isBlank()) {
                cmd.add("--api-key");
                cmd.add(request.getApiKey().trim());
            }

            if (request.getPrompt() != null && !request.getPrompt().isBlank()) {
                cmd.add("--prompt");
                cmd.add(request.getPrompt().trim());
            }

            log.info("Running transcription: {}", String.join(" ", cmd));
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.environment().put("PYTHONIOENCODING", "utf-8");
            pb.environment().put("PYTHONUTF8", "1");
            pb.environment().put("HF_HUB_DISABLE_SYMLINKS_WARNING", "1");
            pb.redirectErrorStream(false);
            Process process = pb.start();

            // Capture stdout
            StringBuilder stdout = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    stdout.append(line).append("\n");
                }
            }

            // Capture stderr
            StringBuilder stderr = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    stderr.append(line).append("\n");
                    log.info("[Whisper-Py] {}", line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("Transcription script failed with code {}: {}", exitCode, stderr);
                TranscriptionResponse err = new TranscriptionResponse();
                err.setStatus("ERROR");
                err.setError("Transcription failed: " + stderr.toString());
                return err;
            }

            // 3. Read output JSON
            String jsonContent;
            if (outputJsonFile.exists()) {
                jsonContent = Files.readString(outputJsonFile.toPath(), StandardCharsets.UTF_8);
            } else {
                jsonContent = stdout.toString();
            }

            JsonNode root = objectMapper.readTree(jsonContent);
            if ("ERROR".equalsIgnoreCase(root.path("status").asText())) {
                TranscriptionResponse err = new TranscriptionResponse();
                err.setStatus("ERROR");
                err.setError(root.path("error").asText("Unknown transcription error"));
                return err;
            }

            TranscriptionResponse response = new TranscriptionResponse();
            response.setStatus("SUCCESS");
            response.setFileId(fileId);
            response.setStreamIndex(streamIndex);
            response.setLanguage(root.path("language").asText("unknown"));
            response.setLanguageName(root.path("language_name").asText(response.getLanguage()));
            response.setLanguageProbability(root.path("language_probability").asDouble(1.0));
            response.setDurationSeconds(root.path("duration_seconds").asDouble(0.0));
            response.setProcessingTimeSeconds(root.path("processing_time_seconds").asDouble(0.0));
            response.setModelUsed(root.path("model_used").asText("whisper"));
            response.setFullText(root.path("full_text").asText(""));
            response.setSrtContent(root.path("srt_content").asText(""));
            response.setVttContent(root.path("vtt_content").asText(""));
            response.setAudioTrackUrl("/api/media/audio/" + fileId + "/" + (streamIndex != null ? streamIndex : 0));

            // Parse segments
            JsonNode segmentsNode = root.path("segments");
            List<TranscriptSegment> segments = new ArrayList<>();
            if (segmentsNode.isArray()) {
                for (JsonNode seg : segmentsNode) {
                    TranscriptSegment segment = new TranscriptSegment();
                    segment.setId(seg.path("id").asInt());
                    segment.setStart(seg.path("start").asDouble());
                    segment.setEnd(seg.path("end").asDouble());
                    segment.setText(seg.path("text").asText());

                    JsonNode wordsNode = seg.path("words");
                    List<WordTiming> words = new ArrayList<>();
                    if (wordsNode.isArray()) {
                        for (JsonNode w : wordsNode) {
                            WordTiming wt = new WordTiming();
                            wt.setWord(w.path("word").asText());
                            wt.setStart(w.path("start").asDouble());
                            wt.setEnd(w.path("end").asDouble());
                            wt.setProbability(w.path("probability").asDouble(1.0));
                            words.add(wt);
                        }
                    }
                    segment.setWords(words);
                    segments.add(segment);
                }
            }
            response.setSegments(segments);

            return response;

        } catch (Exception e) {
            log.error("Error during transcription", e);
            TranscriptionResponse err = new TranscriptionResponse();
            err.setStatus("ERROR");
            err.setError("Transcription exception: " + e.getMessage());
            return err;
        }
    }
}
