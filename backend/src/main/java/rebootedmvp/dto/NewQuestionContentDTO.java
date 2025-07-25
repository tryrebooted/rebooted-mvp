package rebootedmvp.dto;

import java.util.List;

public class NewQuestionContentDTO extends NewContentDTO {

    private List<String> options;
    private String correctAnswer;

    public NewQuestionContentDTO() {
    }

    public NewQuestionContentDTO(String type, String title, String body, Long moduleId,
            List<String> options, String correctAnswer) {
        super(type, title, body, moduleId, options, correctAnswer);
    }

    // Getters and Setters
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

}
