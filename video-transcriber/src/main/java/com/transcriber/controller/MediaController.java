package com.transcriber.controller;

import com.transcriber.dto.MediaMetadataResponse;
import com.transcriber.dto.MediaStreamInfo;
import com.transcriber.dto.TranscriptionRequest;
import com.transcriber.dto.TranscriptionResponse;
import com.transcriber.service.FFmpegService;
import com.transcriber.service.StorageService;
import com.transcriber.service.TranscriptionService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    private final StorageService storageService;
    private final FFmpegService ffmpegService;
    private final TranscriptionService transcriptionService;

    public MediaController(StorageService storageService, FFmpegService ffmpegService, TranscriptionService transcriptionService) {
        this.storageService = storageService;
        this.ffmpegService = ffmpegService;
        this.transcriptionService = transcriptionService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a non-empty video/audio file"));
        }

        try {
            String fileId = storageService.storeUpload(file);
            File uploadedFile = storageService.getUploadedFile(fileId);

            MediaMetadataResponse metadata = ffmpegService.probeMedia(uploadedFile, fileId);
            return ResponseEntity.ok(metadata);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process media file: " + e.getMessage()));
        }
    }

    @PostMapping("/transcribe")
    public ResponseEntity<TranscriptionResponse> transcribe(@RequestBody TranscriptionRequest request) {
        TranscriptionResponse response = transcriptionService.transcribe(request);
        if ("ERROR".equalsIgnoreCase(response.getStatus())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transcribe-all")
    public ResponseEntity<?> transcribeAllTracks(@RequestBody TranscriptionRequest request) {
        String fileId = request.getFileId();
        File videoFile = storageService.getUploadedFile(fileId);
        if (videoFile == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "File not found: " + fileId));
        }

        try {
            MediaMetadataResponse metadata = ffmpegService.probeMedia(videoFile, fileId);
            List<TranscriptionResponse> results = new ArrayList<>();

            if (metadata.getAudioStreams().isEmpty()) {
                // Transcribe default stream
                TranscriptionRequest singleReq = new TranscriptionRequest();
                singleReq.setFileId(fileId);
                singleReq.setLanguage(request.getLanguage());
                singleReq.setModel(request.getModel());
                singleReq.setDevice(request.getDevice());
                singleReq.setApiKey(request.getApiKey());
                results.add(transcriptionService.transcribe(singleReq));
            } else {
                for (MediaStreamInfo stream : metadata.getAudioStreams()) {
                    TranscriptionRequest streamReq = new TranscriptionRequest();
                    streamReq.setFileId(fileId);
                    streamReq.setStreamIndex(stream.getIndex());
                    
                    // Match language if track has language tag, else use request language
                    String streamLang = stream.getLanguage();
                    if (streamLang != null && !streamLang.equalsIgnoreCase("und")) {
                        streamReq.setLanguage(streamLang);
                    } else {
                        streamReq.setLanguage(request.getLanguage());
                    }
                    streamReq.setModel(request.getModel());
                    streamReq.setDevice(request.getDevice());
                    streamReq.setApiKey(request.getApiKey());

                    TranscriptionResponse res = transcriptionService.transcribe(streamReq);
                    res.setTrackTitle(stream.getTitle() + " (" + stream.getLanguageLabel() + ")");
                    results.add(res);
                }
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to batch transcribe tracks: " + e.getMessage()));
        }
    }

    @GetMapping("/stream/{fileId}")
    public ResponseEntity<ResourceRegion> streamVideo(
            @PathVariable("fileId") String fileId,
            @RequestHeader HttpHeaders headers) throws IOException {

        File file = storageService.getUploadedFile(fileId);
        if (file == null || !file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        List<HttpRange> ranges = headers.getRange();
        HttpRange range = ranges.isEmpty() ? null : ranges.get(0);
        ResourceRegion region = storageService.getResourceRegion(resource, range);

        String ext = FilenameUtils.getExtension(file.getName()).toLowerCase();
        MediaType mediaType = MediaType.parseMediaType(
                ext.equals("mp4") ? "video/mp4" :
                ext.equals("webm") ? "video/webm" :
                ext.equals("mkv") ? "video/x-matroska" :
                ext.equals("mov") ? "video/quicktime" :
                ext.equals("mp3") ? "audio/mpeg" :
                ext.equals("wav") ? "audio/wav" : "application/octet-stream"
        );

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(mediaType)
                .body(region);
    }

    @GetMapping("/audio/{fileId}/{streamIndex}")
    public ResponseEntity<ResourceRegion> streamAudioTrack(
            @PathVariable("fileId") String fileId,
            @PathVariable("streamIndex") Integer streamIndex,
            @RequestHeader HttpHeaders headers) throws IOException {

        File file = storageService.getExtractedAudioFile(fileId, streamIndex);
        if (!file.exists()) {
            File videoFile = storageService.getUploadedFile(fileId);
            if (videoFile != null && videoFile.exists()) {
                try {
                    ffmpegService.extractAudioToWav(videoFile, file, streamIndex);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        Resource resource = new FileSystemResource(file);
        List<HttpRange> ranges = headers.getRange();
        HttpRange range = ranges.isEmpty() ? null : ranges.get(0);
        ResourceRegion region = storageService.getResourceRegion(resource, range);

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaType.parseMediaType("audio/wav"))
                .body(region);
    }

    @GetMapping("/export/{fileId}/{format}")
    public ResponseEntity<byte[]> exportTranscript(
            @PathVariable("fileId") String fileId,
            @PathVariable("format") String format,
            @RequestParam(value = "streamIndex", required = false) Integer streamIndex) {

        File jsonFile = storageService.getTranscriptJsonFile(fileId, streamIndex);
        if (!jsonFile.exists()) {
            return ResponseEntity.notFound().build();
        }

        try {
            String jsonStr = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            com.fasterxml.jackson.databind.JsonNode root = new com.fasterxml.jackson.databind.ObjectMapper().readTree(jsonStr);

            String content;
            String filename;
            MediaType mediaType;

            String fmt = format.toLowerCase();
            if ("srt".equals(fmt)) {
                content = root.path("srt_content").asText();
                filename = fileId + ".srt";
                mediaType = MediaType.parseMediaType("text/plain; charset=utf-8");
            } else if ("vtt".equals(fmt)) {
                content = root.path("vtt_content").asText();
                filename = fileId + ".vtt";
                mediaType = MediaType.parseMediaType("text/vtt; charset=utf-8");
            } else if ("json".equals(fmt)) {
                content = jsonStr;
                filename = fileId + ".json";
                mediaType = MediaType.APPLICATION_JSON;
            } else {
                // txt
                content = root.path("full_text").asText();
                filename = fileId + ".txt";
                mediaType = MediaType.parseMediaType("text/plain; charset=utf-8");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
            headers.setContentType(mediaType);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(content.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
