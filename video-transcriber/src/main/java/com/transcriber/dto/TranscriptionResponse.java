package com.transcriber.dto;

import java.util.ArrayList;
import java.util.List;

public class TranscriptionResponse {
    private String status; // SUCCESS, ERROR
    private String fileId;
    private Integer streamIndex;
    private String trackTitle;
    private String language;
    private String languageName;
    private double languageProbability;
    private double durationSeconds;
    private double processingTimeSeconds;
    private String modelUsed;
    private String fullText;
    private List<TranscriptSegment> segments = new ArrayList<>();
    private String srtContent;
    private String vttContent;
    private String error;
    private String audioTrackUrl;

    public TranscriptionResponse() {}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public Integer getStreamIndex() {
        return streamIndex;
    }

    public void setStreamIndex(Integer streamIndex) {
        this.streamIndex = streamIndex;
    }

    public String getTrackTitle() {
        return trackTitle;
    }

    public void setTrackTitle(String trackTitle) {
        this.trackTitle = trackTitle;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLanguageName() {
        return languageName;
    }

    public void setLanguageName(String languageName) {
        this.languageName = languageName;
    }

    public double getLanguageProbability() {
        return languageProbability;
    }

    public void setLanguageProbability(double languageProbability) {
        this.languageProbability = languageProbability;
    }

    public double getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(double durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public double getProcessingTimeSeconds() {
        return processingTimeSeconds;
    }

    public void setProcessingTimeSeconds(double processingTimeSeconds) {
        this.processingTimeSeconds = processingTimeSeconds;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public String getFullText() {
        return fullText;
    }

    public void setFullText(String fullText) {
        this.fullText = fullText;
    }

    public List<TranscriptSegment> getSegments() {
        return segments;
    }

    public void setSegments(List<TranscriptSegment> segments) {
        this.segments = segments;
    }

    public String getSrtContent() {
        return srtContent;
    }

    public void setSrtContent(String srtContent) {
        this.srtContent = srtContent;
    }

    public String getVttContent() {
        return vttContent;
    }

    public void setVttContent(String vttContent) {
        this.vttContent = vttContent;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getAudioTrackUrl() {
        return audioTrackUrl;
    }

    public void setAudioTrackUrl(String audioTrackUrl) {
        this.audioTrackUrl = audioTrackUrl;
    }
}
