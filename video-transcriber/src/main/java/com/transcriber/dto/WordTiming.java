package com.transcriber.dto;

public class WordTiming {
    private String word;
    private double start;
    private double end;
    private double probability;

    public WordTiming() {}

    public WordTiming(String word, double start, double end, double probability) {
        this.word = word;
        this.start = start;
        this.end = end;
        this.probability = probability;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public double getStart() {
        return start;
    }

    public void setStart(double start) {
        this.start = start;
    }

    public double getEnd() {
        return end;
    }

    public void setEnd(double end) {
        this.end = end;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }
}
