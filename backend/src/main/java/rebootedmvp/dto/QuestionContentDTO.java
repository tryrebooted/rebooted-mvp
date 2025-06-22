package rebootedmvp.dto;

import java.util.List;

public class QuestionContentDTO extends ContentDTO {
    private List<String> options;
    private String correctAnswer;
    private String userAnswer;

    public QuestionContentDTO() {}

    public QuestionContentDTO(Long id, String title, String body, boolean isComplete, Long moduleId,
                             List<String> options, String correctAnswer, String userAnswer) {
        super(id, "Question", title, body, isComplete, moduleId);
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.userAnswer = userAnswer;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
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
}