package com.transcriber.dto;

public class TranscriptionRequest {
    private String fileId;
    private Integer streamIndex; // audio stream index or null for default/all
    private String language = "auto"; // "en", "hi", "ta", "auto"
    private String model = "base"; // "tiny", "base", "small", "medium"
    private String device = "cpu"; // "cpu" or "cuda"
    private String apiKey; // optional OpenAI API key
    private String prompt; // optional domain context prompt

    public TranscriptionRequest() {}

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
