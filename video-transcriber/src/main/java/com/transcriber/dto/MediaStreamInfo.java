package com.transcriber.dto;

public class MediaStreamInfo {
    private int index;
    private String codecType; // video, audio, subtitle
    private String codecName;
    private String language;
    private String languageLabel;
    private String title;
    private int channels;
    private String channelLayout;
    private int sampleRate;
    private long bitRate;
    private String duration;
    private boolean defaultTrack;

    public MediaStreamInfo() {}

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getCodecType() {
        return codecType;
    }

    public void setCodecType(String codecType) {
        this.codecType = codecType;
    }

    public String getCodecName() {
        return codecName;
    }

    public void setCodecName(String codecName) {
        this.codecName = codecName;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLanguageLabel() {
        return languageLabel;
    }

    public void setLanguageLabel(String languageLabel) {
        this.languageLabel = languageLabel;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getChannels() {
        return channels;
    }

    public void setChannels(int channels) {
        this.channels = channels;
    }

    public String getChannelLayout() {
        return channelLayout;
    }

    public void setChannelLayout(String channelLayout) {
        this.channelLayout = channelLayout;
    }

    public int getSampleRate() {
        return sampleRate;
    }

    public void setSampleRate(int sampleRate) {
        this.sampleRate = sampleRate;
    }

    public long getBitRate() {
        return bitRate;
    }

    public void setBitRate(long bitRate) {
        this.bitRate = bitRate;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public boolean isDefaultTrack() {
        return defaultTrack;
    }

    public void setDefaultTrack(boolean defaultTrack) {
        this.defaultTrack = defaultTrack;
    }
}
