package rebootedmvp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rebootedmvp.dto.CourseUserDTO;
import rebootedmvp.dto.UserCourseDTO;
import rebootedmvp.dto.UserProfileDTO;
import rebootedmvp.domain.impl.CourseImpl;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class CourseMembershipService {
    
    // courseId -> userId -> role
    private final Map<Long, Map<String, String>> courseMemberships = new ConcurrentHashMap<>();
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserProfileService userProfileService;

    public boolean addUserToCourse(Long courseId, String userId, String role) {
        if (courseService.findById(courseId) == null) {
            return false;
        }
        if (userProfileService.findById(userId) == null) {
            return false;
        }
        
        courseMemberships.computeIfAbsent(courseId, k -> new ConcurrentHashMap<>())
                         .put(userId, role);
        return true;
    }

    public boolean removeUserFromCourse(Long courseId, String userId) {
        Map<String, String> courseUsers = courseMemberships.get(courseId);
        if (courseUsers == null) {
            return false;
        }
        return courseUsers.remove(userId) != null;
    }

    public List<CourseUserDTO> getCourseUsers(Long courseId) {
        Map<String, String> courseUsers = courseMemberships.get(courseId);
        if (courseUsers == null) {
            return List.of();
        }

        return courseUsers.entrySet().stream()
                .map(entry -> {
                    String userId = entry.getKey();
                    String role = entry.getValue();
                    UserProfileDTO user = userProfileService.findById(userId);
                    return new CourseUserDTO(courseId, userId, role, 
                                           user != null ? user.getUsername() : null,
                                           user != null ? user.getFullName() : null);
                })
                .collect(Collectors.toList());
    }

    public List<UserCourseDTO> getUserCourses(String userId) {
        return courseMemberships.entrySet().stream()
                .filter(entry -> entry.getValue().containsKey(userId))
                .map(entry -> {
                    Long courseId = entry.getKey();
                    String role = entry.getValue().get(userId);
                    var course = courseService.findById(courseId);
                    return course != null ? 
                           new UserCourseDTO(courseId, course.getName(), course.getDescription(), role) : 
                           null;
                })
                .filter(course -> course != null)
                .collect(Collectors.toList());
    }

    public boolean addUsersByCourse(Long courseId, List<String> usernames, String role) {
        if (courseService.findById(courseId) == null) {
            return false;
        }

        List<UserProfileDTO> users = userProfileService.findByUsernames(usernames);
        if (users.size() != usernames.size()) {
            return false; // Some users don't exist
        }

        Map<String, String> courseUsers = courseMemberships.computeIfAbsent(courseId, k -> new ConcurrentHashMap<>());
        users.forEach(user -> courseUsers.put(user.getId(), role));
        
        return true;
    }
}