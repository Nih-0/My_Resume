package com.transcriber.dto;

import java.util.ArrayList;
import java.util.List;

public class MediaMetadataResponse {
    private String fileId;
    private String fileName;
    private long fileSize;
    private double durationSeconds;
    private String formattedDuration;
    private String formatName;
    private int width;
    private int height;
    private String videoCodec;
    private List<MediaStreamInfo> audioStreams = new ArrayList<>();
    private List<MediaStreamInfo> subtitleStreams = new ArrayList<>();
    private String streamUrl;

    public MediaMetadataResponse() {}

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public double getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(double durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getFormattedDuration() {
        return formattedDuration;
    }

    public void setFormattedDuration(String formattedDuration) {
        this.formattedDuration = formattedDuration;
    }

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getVideoCodec() {
        return videoCodec;
    }

    public void setVideoCodec(String videoCodec) {
        this.videoCodec = videoCodec;
    }

    public List<MediaStreamInfo> getAudioStreams() {
        return audioStreams;
    }

    public void setAudioStreams(List<MediaStreamInfo> audioStreams) {
        this.audioStreams = audioStreams;
    }

    public List<MediaStreamInfo> getSubtitleStreams() {
        return subtitleStreams;
    }

    public void setSubtitleStreams(List<MediaStreamInfo> subtitleStreams) {
        this.subtitleStreams = subtitleStreams;
    }

    public String getStreamUrl() {
        return streamUrl;
    }

    public void setStreamUrl(String streamUrl) {
        this.streamUrl = streamUrl;
    }
}
