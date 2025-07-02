package rebootedmvp.dto;

import rebootedmvp.Module;

public class ModuleDTO {

    private Long id;
    private String title;
    private String body;
    private double progress;
    private Long courseId;
    private int contentCount;

    public ModuleDTO(Module mod) {
        this.id = mod.getId();
        this.title = mod.getTitle();
        this.body = mod.getBody();
        this.courseId = mod.getCourseId();
        this.contentCount = mod.getContent().size();
    }

    public ModuleDTO(Long id, String title, String body, Long courseId, int contentCount) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.courseId = courseId;
        this.contentCount = contentCount;
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

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getContentCount() {
        return contentCount;
    }

    public void setContentCount(int contentCount) {
        this.contentCount = contentCount;
    }
}
