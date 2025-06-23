package rebootedmvp.dto;

public class ContentDTO {

    private Long id;
    private String type;
    private String title;
    private String body;
    private boolean isComplete;
    private Long moduleId;

    public ContentDTO() {
    }

    public ContentDTO(Long id, String type, String title, String body, boolean isComplete, Long moduleId) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.body = body;
        this.isComplete = isComplete;
        this.moduleId = moduleId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }
}
