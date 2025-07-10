package rebootedmvp.dto;

import rebootedmvp.User;

public class UserCourseDTO {
    private Long id;
    private String title;
    private String body;
    private User.UserType role;

    public UserCourseDTO() {
    }

    public UserCourseDTO(Long id, String title, String body, User.UserType role) {
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

    public User.UserType getRole() {
        return role;
    }

    public void setRole(User.UserType role) {
        this.role = role;
    }
}