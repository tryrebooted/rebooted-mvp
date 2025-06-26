package rebootedmvp.dto;

import rebootedmvp.Module;

public class ModuleDTO {

    private Long id;
    private String name;
    private String description;
    private double progress;
    private Long courseId;
    private int contentCount;

    public ModuleDTO(Module mod) {
        this.id = mod.getId();
        this.name = mod.getTitle();
        this.description = mod.getBody();
        this.courseId = mod.getCourseId();
        this.contentCount = mod.getContent().size();
    }

    public ModuleDTO(Long id, String name, String description, Long courseId, int contentCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.courseId = courseId;
        this.contentCount = contentCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
