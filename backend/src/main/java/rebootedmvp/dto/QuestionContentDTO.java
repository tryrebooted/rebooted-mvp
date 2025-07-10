package rebootedmvp.dto;

import java.util.List;

import rebootedmvp.Content;

public class QuestionContentDTO extends ContentDTO {

    private List<String> options;
    private String correctAnswer;

    // public QuestionContentDTO() {
    // super()
    // }
    public QuestionContentDTO(Long id, String title, String body, boolean isComplete, Long moduleId,
            List<String> options, String correctAnswer) {
        super(id, Content.ContentType.Question, title, body, isComplete, moduleId);
        this.options = options;
        this.correctAnswer = correctAnswer;
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

}
