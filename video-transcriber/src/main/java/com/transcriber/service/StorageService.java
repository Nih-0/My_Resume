package com.transcriber.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpRange;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StorageService {

    @Value("${app.storage.uploads-dir:./storage/uploads}")
    private String uploadsDir;

    @Value("${app.storage.extracted-dir:./storage/extracted}")
    private String extractedDir;

    @Value("${app.storage.transcripts-dir:./storage/transcripts}")
    private String transcriptsDir;

    private Path uploadsPath;
    private Path extractedPath;
    private Path transcriptsPath;

    // In-memory mapping of fileId -> original filename
    private final ConcurrentHashMap<String, String> originalNames = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        try {
            uploadsPath = Paths.get(uploadsDir).toAbsolutePath().normalize();
            extractedPath = Paths.get(extractedDir).toAbsolutePath().normalize();
            transcriptsPath = Paths.get(transcriptsDir).toAbsolutePath().normalize();

            Files.createDirectories(uploadsPath);
            Files.createDirectories(extractedPath);
            Files.createDirectories(transcriptsPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage directories", e);
        }
    }

    public String storeUpload(MultipartFile file) throws IOException {
        String fileId = UUID.randomUUID().toString();
        String originalFilename = file.getOriginalFilename();
        String ext = FilenameUtils.getExtension(originalFilename);
        if (ext == null || ext.isBlank()) {
            ext = "mp4";
        }
        String targetFilename = fileId + "." + ext;
        Path targetPath = uploadsPath.resolve(targetFilename);

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        originalNames.put(fileId, originalFilename != null ? originalFilename : targetFilename);
        return fileId;
    }

    public File getUploadedFile(String fileId) {
        File dir = uploadsPath.toFile();
        File[] matching = dir.listFiles((d, name) -> name.startsWith(fileId + "."));
        if (matching != null && matching.length > 0) {
            return matching[0];
        }
        return null;
    }

    public File getExtractedAudioFile(String fileId, Integer streamIndex) {
        String filename = streamIndex != null 
                ? fileId + "_stream" + streamIndex + ".wav"
                : fileId + "_audio.wav";
        return extractedPath.resolve(filename).toFile();
    }

    public File getTranscriptJsonFile(String fileId, Integer streamIndex) {
        String filename = streamIndex != null 
                ? fileId + "_stream" + streamIndex + "_transcript.json"
                : fileId + "_transcript.json";
        return transcriptsPath.resolve(filename).toFile();
    }

    public String getOriginalFilename(String fileId) {
        return originalNames.getOrDefault(fileId, fileId);
    }

    public ResourceRegion getResourceRegion(Resource resource, HttpRange range) throws IOException {
        long contentLength = resource.contentLength();
        if (range != null) {
            long start = range.getRangeStart(contentLength);
            long end = range.getRangeEnd(contentLength);
            long rangeLength = Math.min(1024 * 1024, end - start + 1); // 1MB chunks
            return new ResourceRegion(resource, start, rangeLength);
        } else {
            long rangeLength = Math.min(1024 * 1024, contentLength);
            return new ResourceRegion(resource, 0, rangeLength);
        }
    }
}
