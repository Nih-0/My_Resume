package com.transcriber.dto;

import java.util.ArrayList;
import java.util.List;

public class TranscriptSegment {
    private int id;
    private double start;
    private double end;
    private String text;
    private List<WordTiming> words = new ArrayList<>();

    public TranscriptSegment() {}

    public TranscriptSegment(int id, double start, double end, String text, List<WordTiming> words) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.text = text;
        this.words = words != null ? words : new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<WordTiming> getWords() {
        return words;
    }

    public void setWords(List<WordTiming> words) {
        this.words = words;
    }
}
