package rebootedmvp.dto;

public class UserProfileDTO {
    private String id;
    private String username;
    private String fullName;
    private String userType;

    public UserProfileDTO() {}

    public UserProfileDTO(String id, String username, String fullName, String userType) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.userType = userType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}