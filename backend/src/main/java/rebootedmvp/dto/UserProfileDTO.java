package rebootedmvp.dto;

import rebootedmvp.User;

public class UserProfileDTO {
    private String supabaseUserId;
    private String username;
    private User.UserType userType;

    public UserProfileDTO(String id, String username, User.UserType userType) {
        this.supabaseUserId = id;
        this.username = username;
        this.userType = userType;
    }

    public String getId() {
        return supabaseUserId;
    }

    public void setSupabaseUserId(String id) {
        this.supabaseUserId = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public User.UserType getUserType() {
        return userType;
    }

    public void setUserType(User.UserType userType) {
        this.userType = userType;
    }
}