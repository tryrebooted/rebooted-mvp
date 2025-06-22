package rebootedmvp.service;

import org.springframework.stereotype.Service;
import rebootedmvp.domain.impl.UserProfileImpl;
import rebootedmvp.dto.UserProfileDTO;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserProfileService {
    private final Map<String, UserProfileImpl> profiles = new ConcurrentHashMap<>();

    public UserProfileService() {
        // Create some test users for development
        createTestUser("teacher1", "Teacher One", "LDUser");
        createTestUser("teacher2", "Teacher Two", "LDUser");
        createTestUser("student1", "Student One", "EmployeeUser");
        createTestUser("student2", "Student Two", "EmployeeUser");
        createTestUser("student3", "Student Three", "EmployeeUser");
    }

    private void createTestUser(String username, String fullName, String userType) {
        String id = UUID.randomUUID().toString();
        UserProfileImpl profile = new UserProfileImpl(id, username, fullName, userType);
        profiles.put(id, profile);
    }

    public List<UserProfileDTO> findAll() {
        return profiles.values().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public UserProfileDTO findById(String id) {
        UserProfileImpl profile = profiles.get(id);
        if (profile == null) {
            return null;
        }
        return convertToDTO(profile);
    }

    public UserProfileDTO findByUsername(String username) {
        return profiles.values().stream()
                .filter(profile -> username.equals(profile.getUsername()))
                .findFirst()
                .map(this::convertToDTO)
                .orElse(null);
    }

    public List<UserProfileDTO> findByUsernames(List<String> usernames) {
        return profiles.values().stream()
                .filter(profile -> usernames.contains(profile.getUsername()))
                .map(this::convertToDTO)
                .toList();
    }

    public boolean validateUsername(String username) {
        return profiles.values().stream()
                .anyMatch(profile -> username.equals(profile.getUsername()));
    }

    public List<String> validateUsernames(List<String> usernames) {
        return usernames.stream()
                .filter(this::validateUsername)
                .toList();
    }

    private UserProfileDTO convertToDTO(UserProfileImpl profile) {
        return new UserProfileDTO(
                profile.getId(),
                profile.getUsername(),
                profile.getFullName(),
                profile.getUserType()
        );
    }
}