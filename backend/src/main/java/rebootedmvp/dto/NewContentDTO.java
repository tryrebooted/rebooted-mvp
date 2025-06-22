package rebootedmvp.dto;

import rebootedmvp.Content;

public class NewContentDTO {
    private String type;
    private String title;
    private String body;
    private Long moduleId;

    public NewContentDTO() {}

    public NewContentDTO(String type, String title, String body, Long moduleId) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.moduleId = moduleId;
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
}