package rebootedmvp.dto;

public class CourseUserDTO {
    private Long courseId;
    private String userId;
    private String role;
    private String username;
    private String fullName;

    public CourseUserDTO() {}

    public CourseUserDTO(Long courseId, String userId, String role, String username, String fullName) {
        this.courseId = courseId;
        this.userId = userId;
        this.role = role;
        this.username = username;
        this.fullName = fullName;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}