package com.transcriber.controller;

import com.transcriber.dto.SystemStatusResponse;
import com.transcriber.service.FFmpegService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "*")
public class SystemController {

    private final FFmpegService ffmpegService;

    @Value("${app.python.path:python}")
    private String pythonPath;

    public SystemController(FFmpegService ffmpegService) {
        this.ffmpegService = ffmpegService;
    }

    @GetMapping("/status")
    public ResponseEntity<SystemStatusResponse> getStatus() {
        SystemStatusResponse status = new SystemStatusResponse();
        status.setFfmpegReady(ffmpegService.isFFmpegAvailable());
        status.setFfmpegPath(ffmpegService.getFfmpegPath());
        status.setFfmpegVersion(ffmpegService.getFfmpegVersion());
        status.setFfprobeReady(ffmpegService.isFFprobeAvailable());
        status.setFfprobePath(ffmpegService.getFfprobePath());

        // Check python
        try {
            Process p = new ProcessBuilder(pythonPath, "--version").start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                String line = reader.readLine();
                if (line != null) {
                    status.setPythonReady(true);
                    status.setPythonPath(pythonPath);
                    status.setPythonVersion(line);
                }
            }
        } catch (Exception e) {
            status.setPythonReady(false);
            status.setPythonVersion("Unavailable: " + e.getMessage());
        }

        // Check faster-whisper
        try {
            Process p = new ProcessBuilder(pythonPath, "-c", "import faster_whisper; print('OK')").start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                String line = reader.readLine();
                status.setFasterWhisperReady("OK".equals(line != null ? line.trim() : ""));
            }
        } catch (Exception e) {
            status.setFasterWhisperReady(false);
        }

        status.setSupportedLanguages(Arrays.asList(
                "English (en)",
                "Hindi - हिन्दी (hi)",
                "Tamil - தமிழ் (ta)",
                "Telugu - తెలుగు (te)",
                "Kannada - ಕನ್ನಡ (kn)",
                "Malayalam - മലയാളം (ml)",
                "Auto-Detect (auto)"
        ));

        status.setSupportedModels(Arrays.asList("tiny", "base", "small", "medium", "large-v3"));

        return ResponseEntity.ok(status);
    }

    @PostMapping("/config")
    public ResponseEntity<?> updateConfig(@RequestBody Map<String, String> config) {
        String ffmpeg = config.get("ffmpegPath");
        String ffprobe = config.get("ffprobePath");
        ffmpegService.setCustomPaths(ffmpeg, ffprobe);

        return ResponseEntity.ok(Map.of(
                "message", "Configuration updated",
                "ffmpegReady", ffmpegService.isFFmpegAvailable(),
                "ffmpegPath", ffmpegService.getFfmpegPath(),
                "ffprobePath", ffmpegService.getFfprobePath()
        ));
    }
}
