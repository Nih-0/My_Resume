package com.transcriber.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.transcriber.dto.MediaMetadataResponse;
import com.transcriber.dto.MediaStreamInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class FFmpegService {

    private static final Logger log = LoggerFactory.getLogger(FFmpegService.class);

    @Value("${app.ffmpeg.path:}")
    private String configuredFfmpegPath;

    @Value("${app.ffprobe.path:}")
    private String configuredFfprobePath;

    private String ffmpegExecutable;
    private String ffprobeExecutable;
    private String ffmpegVersionString = "Unknown";
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, String> LANGUAGE_MAP = Map.ofEntries(
            Map.entry("eng", "English"),
            Map.entry("en", "English"),
            Map.entry("hin", "Hindi (हिन्दी)"),
            Map.entry("hi", "Hindi (हिन्दी)"),
            Map.entry("tam", "Tamil (தமிழ்)"),
            Map.entry("ta", "Tamil (தமிழ்)"),
            Map.entry("tel", "Telugu (తెలుగు)"),
            Map.entry("te", "Telugu (తెలుగు)"),
            Map.entry("kan", "Kannada (ಕನ್ನಡ)"),
            Map.entry("kn", "Kannada (ಕನ್ನಡ)"),
            Map.entry("mal", "Malayalam (മലയാളം)"),
            Map.entry("ml", "Malayalam (മലയാളം)"),
            Map.entry("mar", "Marathi (मराठी)"),
            Map.entry("mr", "Marathi (मराठी)"),
            Map.entry("ben", "Bengali (বাংলা)"),
            Map.entry("bn", "Bengali (বাংলা)"),
            Map.entry("guj", "Gujarati (ગુજરાતી)"),
            Map.entry("gu", "Gujarati (ગુજરાતી)"),
            Map.entry("pan", "Punjabi (ਪੰਜਾਬੀ)"),
            Map.entry("pa", "Punjabi (ਪੰਜਾਬੀ)"),
            Map.entry("urd", "Urdu (اردو)"),
            Map.entry("ur", "Urdu (اردو)"),
            Map.entry("spa", "Spanish"),
            Map.entry("fre", "French"),
            Map.entry("fra", "French"),
            Map.entry("ger", "German"),
            Map.entry("deu", "German"),
            Map.entry("chi", "Chinese"),
            Map.entry("zho", "Chinese"),
            Map.entry("jpn", "Japanese"),
            Map.entry("kor", "Korean"),
            Map.entry("ara", "Arabic"),
            Map.entry("und", "Undetermined / Default")
    );

    @PostConstruct
    public void init() {
        resolveExecutables();
    }

    public synchronized void resolveExecutables() {
        List<String> candidateFfmpeg = Arrays.asList(
                configuredFfmpegPath,
                "C:/Users/Nihal/Downloads/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/bin/ffmpeg.exe",
                "C:\\Users\\Nihal\\Downloads\\ffmpeg-2026-02-09-git-9bfa1635ae-full_build\\ffmpeg-2026-02-09-git-9bfa1635ae-full_build\\bin\\ffmpeg.exe",
                "C:/Users/Nihal/Downloads/ffmpeg-9.0.2/bin/ffmpeg.exe",
                "C:\\Users\\Nihal\\Downloads\\ffmpeg-9.0.2\\bin\\ffmpeg.exe",
                "ffmpeg.exe",
                "ffmpeg"
        );

        List<String> candidateFfprobe = Arrays.asList(
                configuredFfprobePath,
                "C:/Users/Nihal/Downloads/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/bin/ffprobe.exe",
                "C:\\Users\\Nihal\\Downloads\\ffmpeg-2026-02-09-git-9bfa1635ae-full_build\\ffmpeg-2026-02-09-git-9bfa1635ae-full_build\\bin\\ffprobe.exe",
                "C:/Users/Nihal/Downloads/ffmpeg-9.0.2/bin/ffprobe.exe",
                "C:\\Users\\Nihal\\Downloads\\ffmpeg-9.0.2\\bin\\ffprobe.exe",
                "ffprobe.exe",
                "ffprobe"
        );

        for (String path : candidateFfmpeg) {
            if (path != null && !path.isBlank()) {
                File f = new File(path);
                if (f.exists() || path.equals("ffmpeg") || path.equals("ffmpeg.exe")) {
                    try {
                        Process process = new ProcessBuilder(path, "-version").start();
                        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                            String firstLine = reader.readLine();
                            if (firstLine != null && firstLine.contains("ffmpeg")) {
                                this.ffmpegExecutable = path;
                                this.ffmpegVersionString = firstLine;
                                log.info("Discovered FFmpeg at: {} ({})", path, firstLine);
                                break;
                            }
                        }
                    } catch (Exception ignored) {}
                }
            }
        }

        for (String path : candidateFfprobe) {
            if (path != null && !path.isBlank()) {
                File f = new File(path);
                if (f.exists() || path.equals("ffprobe") || path.equals("ffprobe.exe")) {
                    try {
                        Process process = new ProcessBuilder(path, "-version").start();
                        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                            String firstLine = reader.readLine();
                            if (firstLine != null && firstLine.contains("ffprobe")) {
                                this.ffprobeExecutable = path;
                                log.info("Discovered FFprobe at: {}", path);
                                break;
                            }
                        }
                    } catch (Exception ignored) {}
                }
            }
        }
    }

    public boolean isFFmpegAvailable() {
        return ffmpegExecutable != null;
    }

    public boolean isFFprobeAvailable() {
        return ffprobeExecutable != null;
    }

    public String getFfmpegPath() {
        return ffmpegExecutable;
    }

    public String getFfprobePath() {
        return ffprobeExecutable;
    }

    public String getFfmpegVersion() {
        return ffmpegVersionString;
    }

    public void setCustomPaths(String ffmpeg, String ffprobe) {
        if (ffmpeg != null && !ffmpeg.isBlank()) this.configuredFfmpegPath = ffmpeg;
        if (ffprobe != null && !ffprobe.isBlank()) this.configuredFfprobePath = ffprobe;
        resolveExecutables();
    }

    public MediaMetadataResponse probeMedia(File mediaFile, String fileId) throws Exception {
        if (!isFFprobeAvailable()) {
            throw new IllegalStateException("FFprobe executable is not available.");
        }

        ProcessBuilder pb = new ProcessBuilder(
                ffprobeExecutable,
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                mediaFile.getAbsolutePath()
        );

        Process process = pb.start();
        StringBuilder jsonOutput = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonOutput.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("FFprobe failed with exit code: " + exitCode);
        }

        JsonNode root = objectMapper.readTree(jsonOutput.toString());
        MediaMetadataResponse metadata = new MediaMetadataResponse();
        metadata.setFileId(fileId);
        metadata.setFileName(mediaFile.getName());
        metadata.setFileSize(mediaFile.length());

        // Format details
        JsonNode formatNode = root.path("format");
        if (!formatNode.isMissingNode()) {
            double duration = formatNode.path("duration").asDouble(0.0);
            metadata.setDurationSeconds(duration);
            metadata.setFormattedDuration(formatSeconds(duration));
            metadata.setFormatName(formatNode.path("format_long_name").asText(formatNode.path("format_name").asText()));
        }

        // Streams
        JsonNode streamsNode = root.path("streams");
        List<MediaStreamInfo> audioStreams = new ArrayList<>();
        List<MediaStreamInfo> subtitleStreams = new ArrayList<>();

        if (streamsNode.isArray()) {
            for (JsonNode stream : streamsNode) {
                String codecType = stream.path("codec_type").asText();
                int streamIndex = stream.path("index").asInt();
                String codecName = stream.path("codec_name").asText();
                JsonNode tags = stream.path("tags");
                String language = tags.path("language").asText("und").toLowerCase();
                String title = tags.path("title").asText("");
                String langLabel = LANGUAGE_MAP.getOrDefault(language, language.toUpperCase());

                if (title.isBlank() && !language.equals("und")) {
                    title = langLabel + " Audio";
                }

                if ("video".equalsIgnoreCase(codecType)) {
                    if (metadata.getVideoCodec() == null) {
                        metadata.setVideoCodec(codecName);
                        metadata.setWidth(stream.path("width").asInt());
                        metadata.setHeight(stream.path("height").asInt());
                        if (metadata.getDurationSeconds() == 0) {
                            double dur = stream.path("duration").asDouble(0.0);
                            metadata.setDurationSeconds(dur);
                            metadata.setFormattedDuration(formatSeconds(dur));
                        }
                    }
                } else if ("audio".equalsIgnoreCase(codecType)) {
                    MediaStreamInfo audioInfo = new MediaStreamInfo();
                    audioInfo.setIndex(streamIndex);
                    audioInfo.setCodecType("audio");
                    audioInfo.setCodecName(codecName);
                    audioInfo.setLanguage(language);
                    audioInfo.setLanguageLabel(langLabel);
                    audioInfo.setTitle(title.isBlank() ? "Audio Track #" + (audioStreams.size() + 1) : title);
                    audioInfo.setChannels(stream.path("channels").asInt());
                    audioInfo.setChannelLayout(stream.path("channel_layout").asText("stereo"));
                    audioInfo.setSampleRate(stream.path("sample_rate").asInt());
                    audioInfo.setBitRate(stream.path("bit_rate").asLong());
                    audioInfo.setDefaultTrack(stream.path("disposition").path("default").asInt(0) == 1);
                    audioStreams.add(audioInfo);
                } else if ("subtitle".equalsIgnoreCase(codecType)) {
                    MediaStreamInfo subInfo = new MediaStreamInfo();
                    subInfo.setIndex(streamIndex);
                    subInfo.setCodecType("subtitle");
                    subInfo.setCodecName(codecName);
                    subInfo.setLanguage(language);
                    subInfo.setLanguageLabel(langLabel);
                    subInfo.setTitle(title.isBlank() ? "Subtitle #" + (subtitleStreams.size() + 1) : title);
                    subtitleStreams.add(subInfo);
                }
            }
        }

        metadata.setAudioStreams(audioStreams);
        metadata.setSubtitleStreams(subtitleStreams);
        metadata.setStreamUrl("/api/media/stream/" + fileId);

        return metadata;
    }

    public void extractAudioToWav(File mediaFile, File outputWav, Integer streamIndex) throws Exception {
        if (!isFFmpegAvailable()) {
            throw new IllegalStateException("FFmpeg executable is not available.");
        }

        List<String> cmd = new ArrayList<>();
        cmd.add(ffmpegExecutable);
        cmd.add("-y"); // overwrite output
        cmd.add("-i");
        cmd.add(mediaFile.getAbsolutePath());

        if (streamIndex != null) {
            cmd.add("-map");
            cmd.add("0:" + streamIndex);
        } else {
            // Default to first audio stream
            cmd.add("-map");
            cmd.add("0:a:0?");
        }

        cmd.add("-vn"); // no video
        cmd.add("-acodec");
        cmd.add("pcm_s16le"); // 16-bit uncompressed PCM
        cmd.add("-ac");
        cmd.add("1"); // mono channel for optimal Whisper transcription
        cmd.add("-ar");
        cmd.add("16000"); // 16kHz standard sampling rate
        cmd.add(outputWav.getAbsolutePath());

        log.info("Executing FFmpeg command: {}", String.join(" ", cmd));
        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        StringBuilder logs = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                logs.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0 || !outputWav.exists() || outputWav.length() == 0) {
            log.error("FFmpeg extraction failed: {}", logs);
            throw new RuntimeException("FFmpeg failed to extract audio (exit code " + exitCode + "): " + logs);
        }

        log.info("Successfully extracted audio to: {} ({} bytes)", outputWav.getAbsolutePath(), outputWav.length());
    }

    private String formatSeconds(double totalSeconds) {
        int hours = (int) (totalSeconds / 3600);
        int minutes = (int) ((totalSeconds % 3600) / 60);
        int seconds = (int) (totalSeconds % 60);
        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format("%02d:%02d", minutes, seconds);
        }
    }
}
