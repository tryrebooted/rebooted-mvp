package rebootedmvp.dto;

import rebootedmvp.Content;
import java.util.List;

public class NewContentDTO {
    private String type;
    private String title;
    private String body;
    private Long moduleId;
    private List<String> options;
    private String correctAnswer;

    public NewContentDTO() {}

    public NewContentDTO(String type, String title, String body, Long moduleId) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.moduleId = moduleId;
    }

    public NewContentDTO(String type, String title, String body, Long moduleId, List<String> options, String correctAnswer) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.moduleId = moduleId;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
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