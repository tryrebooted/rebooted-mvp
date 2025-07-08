package rebootedmvp.dto;

import rebootedmvp.User;

public class CourseUserDTO {
    private Long courseId;
    private String userId;
    private User.UserType role;
    private String username;

    public CourseUserDTO() {
    }

    public CourseUserDTO(Long courseId, String userId, User.UserType role, String username) {
        this.courseId = courseId;
        this.userId = userId;
        this.role = role;
        this.username = username;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public User.UserType getRole() {
        return role;
    }

    public void setRole(User.UserType role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}