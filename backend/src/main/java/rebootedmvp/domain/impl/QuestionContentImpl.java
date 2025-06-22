package rebootedmvp.domain.impl;

import rebootedmvp.Content;

import java.util.ArrayList;
import java.util.List;

public class QuestionContentImpl implements Content {
    private Long id;
    private String title;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private String userAnswer;
    private Long moduleId;

    public QuestionContentImpl() {
        this.options = new ArrayList<>();
    }

    public QuestionContentImpl(Long id, String title, String questionText, List<String> options, 
                              String correctAnswer, Long moduleId) {
        this.id = id;
        this.title = title;
        this.questionText = questionText;
        this.options = new ArrayList<>(options);
        this.correctAnswer = correctAnswer;
        this.moduleId = moduleId;
        this.userAnswer = null;
    }

    @Override
    public boolean isComplete() {
        return userAnswer != null && userAnswer.equals(correctAnswer);
    }

    @Override
    public Content getContent() {
        return this;
    }

    @Override
    public ContentType contentType() {
        return ContentType.Question;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        return new ArrayList<>(options);
    }

    public void setOptions(List<String> options) {
        this.options = new ArrayList<>(options);
    }

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

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }
}