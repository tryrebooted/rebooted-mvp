package rebootedmvp.dto;

public class UserCourseDTO {
    private Long id;
    private String name;
    private String description;
    private String role;

    public UserCourseDTO() {}

    public UserCourseDTO(Long id, String name, String description, String role) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.role = role;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}