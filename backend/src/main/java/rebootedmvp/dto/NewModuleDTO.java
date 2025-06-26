package rebootedmvp.dto;

public class NewModuleDTO implements NewDTO {

    private String title;
    private String body;
    private Long courseId;

    public NewModuleDTO() {
    }

    public NewModuleDTO(String title, String body, Long courseId) {
        this.title = title;
        this.body = body;
        this.courseId = courseId;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String body) {
        this.body = body;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

}
