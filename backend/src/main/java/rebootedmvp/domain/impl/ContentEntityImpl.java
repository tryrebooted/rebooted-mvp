package rebootedmvp.domain.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import rebootedmvp.Content;
import rebootedmvp.Module;

/**
 * JPA Entity implementation of Content interface for database persistence.
 * This replaces the in-memory TextContentImpl and QuestionContentImpl with
 * proper database mapping.
 */
@Entity
// @Inheritance(strategy = InheritanceType.SINGLE_TABLE)
// @DiscriminatorColumn(name = "content_type", discriminatorType =
// DiscriminatorType.STRING)
// @DiscriminatorValue("CONTENT")
public class ContentEntityImpl extends Content {

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public ContentEntityImpl() {
    }

    public ContentEntityImpl(String title, String body, Module module, ContentType contentType) {
        this.title = title;
        this.body = body;
        this.moduleId = module.getId();
        this.isComplete = false;
    }

    // Constructor for Question content
    public ContentEntityImpl(String title, String questionText, List<String> options,
            String correctAnswer, Module module) {
        this.title = title;
        this.questionText = questionText;
        this.optionText = new ArrayList<>(options);
        this.correctAnswer = correctAnswer;
        this.moduleId = module.getId();
        this.isComplete = false;
    }

    public ContentEntityImpl(Content c) {
        this.body = c.getBody();
        this.id = c.getId();
        this.title = c.getTitle();
        this.optionText = c.getOptions();
        this.correctAnswer = c.getCorrectAnswer();
        this.moduleId = c.getModuleId();
        this.isComplete = false;
    }

    // Content interface methods
    @Override
    public boolean isComplete() {
        if (getType() == ContentType.Question) {
            return userAnswer != null && userAnswer.equals(correctAnswer);
        }
        return isComplete;
    }

    @Override
    public ContentType getType() {
        // Default to Text - this will be overridden by discriminator in subclasses
        return ContentType.Text;
    }

    // HasID interface methods
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String body) {
        this.body = body;
    }

    // Additional getters and setters
    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public void setComplete(boolean complete) {
        this.isComplete = complete;
    }

    @Override
    public Long getModuleId() {
        return moduleId;
    }

    @Override
    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    @Override
    public List<String> getOptions() {
        return new ArrayList<>(optionText);
    }

    public void setOptions(List<String> options) {
        this.optionText = new ArrayList<>(options != null ? options : new ArrayList<>());
    }

    @Override
    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
