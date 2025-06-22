package rebootedmvp.dto;

public class ModuleDTO {
    private Long id;
    private String name;
    private String description;
    private double progress;
    private Long courseId;
    private int contentCount;

    public ModuleDTO() {}

    public ModuleDTO(Long id, String name, String description, double progress, Long courseId, int contentCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.progress = progress;
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

    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
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