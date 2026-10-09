package com.transcriber.dto;

import java.util.List;

public class SystemStatusResponse {
    private boolean ffmpegReady;
    private String ffmpegPath;
    private String ffmpegVersion;
    private boolean ffprobeReady;
    private String ffprobePath;
    private boolean pythonReady;
    private String pythonPath;
    private String pythonVersion;
    private boolean fasterWhisperReady;
    private List<String> supportedLanguages;
    private List<String> supportedModels;

    public SystemStatusResponse() {}

    public boolean isFfmpegReady() {
        return ffmpegReady;
    }

    public void setFfmpegReady(boolean ffmpegReady) {
        this.ffmpegReady = ffmpegReady;
    }

    public String getFfmpegPath() {
        return ffmpegPath;
    }

    public void setFfmpegPath(String ffmpegPath) {
        this.ffmpegPath = ffmpegPath;
    }

    public String getFfmpegVersion() {
        return ffmpegVersion;
    }

    public void setFfmpegVersion(String ffmpegVersion) {
        this.ffmpegVersion = ffmpegVersion;
    }

    public boolean isFfprobeReady() {
        return ffprobeReady;
    }

    public void setFfprobeReady(boolean ffprobeReady) {
        this.ffprobeReady = ffprobeReady;
    }

    public String getFfprobePath() {
        return ffprobePath;
    }

    public void setFfprobePath(String ffprobePath) {
        this.ffprobePath = ffprobePath;
    }

    public boolean isPythonReady() {
        return pythonReady;
    }

    public void setPythonReady(boolean pythonReady) {
        this.pythonReady = pythonReady;
    }

    public String getPythonPath() {
        return pythonPath;
    }

    public void setPythonPath(String pythonPath) {
        this.pythonPath = pythonPath;
    }

    public String getPythonVersion() {
        return pythonVersion;
    }

    public void setPythonVersion(String pythonVersion) {
        this.pythonVersion = pythonVersion;
    }

    public boolean isFasterWhisperReady() {
        return fasterWhisperReady;
    }

    public void setFasterWhisperReady(boolean fasterWhisperReady) {
        this.fasterWhisperReady = fasterWhisperReady;
    }

    public List<String> getSupportedLanguages() {
        return supportedLanguages;
    }

    public void setSupportedLanguages(List<String> supportedLanguages) {
        this.supportedLanguages = supportedLanguages;
    }

    public List<String> getSupportedModels() {
        return supportedModels;
    }

    public void setSupportedModels(List<String> supportedModels) {
        this.supportedModels = supportedModels;
    }
}
