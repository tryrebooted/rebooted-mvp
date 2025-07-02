package rebootedmvp.dto;

public class UserCourseDTO {
    private Long id;
    private String title;
    private String body;
    private String role;

    public UserCourseDTO() {}

    public UserCourseDTO(Long id, String title, String body, String role) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.role = role;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}