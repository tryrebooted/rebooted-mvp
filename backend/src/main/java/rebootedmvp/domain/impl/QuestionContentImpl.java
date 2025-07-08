package rebootedmvp.domain.impl;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import rebootedmvp.Content;

@Entity
@DiscriminatorValue("QUESTION")
public class QuestionContentImpl extends Content {

    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private boolean complete;

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
        complete = false;
    }

    @Override
    public boolean isComplete() {
        return complete;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
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

    @Override
    public Long getModuleId() {
        return moduleId;
    }

    @Override
    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    @Override
    public ContentType getType() {
        return ContentType.Question;
    }

    @Override
    public String getBody() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void setBody(String newBody) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void setComplete(boolean complete) {
        throw new UnsupportedOperationException("Unimplemented method 'setComplete'");
    }
}
