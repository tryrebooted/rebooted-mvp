package rebootedmvp.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import rebootedmvp.dto.CourseUserDTO;
import rebootedmvp.dto.UserCourseDTO;
import rebootedmvp.dto.UserProfileDTO;

@Service
public class CourseMembershipService {

    // courseId -> userId -> role
    private final Map<Long, Map<String, String>> courseMemberships = new ConcurrentHashMap<>();

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    @Lazy
    private CourseService courseService;

    public boolean addUserToCourse(Long courseId, String userId, String role) {
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

        return new LinkedList<>();

        // Handle both username and UUID-based lookups
        // final String actualUserId;
        // // Check if the provided userId is actually a username
        // UserProfileDTO userByUsername = userProfileService.findByUsername(userId);
        // if (userByUsername != null) {
        //     actualUserId = userByUsername.getId();
        // } else {
        //     actualUserId = userId;
        // }
        // return courseMemberships.entrySet().stream()
        //         .filter(entry -> entry.getValue().containsKey(actualUserId))
        //         .map(entry -> {
        //             Long courseId = entry.getKey();
        //             String role = entry.getValue().get(actualUserId);
        //             CourseDTO course = courseService.getById(courseId);
        //             return course != null
        //                     ? new UserCourseDTO(courseId, course.getName(), course.getDescription(), role)
        //                     : null;
        //         })
        //         .filter(course -> course != null)
        //         .collect(Collectors.toList());
    }

    public boolean addUsersByCourse(Long courseId, List<String> usernames, String role) {
        List<UserProfileDTO> users = userProfileService.findByUsernames(usernames);
        if (users.size() != usernames.size()) {
            return false; // Some users don't exist
        }

        Map<String, String> courseUsers = courseMemberships.computeIfAbsent(courseId, k -> new ConcurrentHashMap<>());
        users.forEach(user -> courseUsers.put(user.getId(), role));

        return true;
    }

    public int getTeacherCount(Long courseId) {
        Map<String, String> courseUsers = courseMemberships.get(courseId);
        if (courseUsers == null) {
            return 0;
        }
        return (int) courseUsers.values().stream()
                .filter(role -> "teacher".equals(role))
                .count();
    }

    public int getStudentCount(Long courseId) {
        Map<String, String> courseUsers = courseMemberships.get(courseId);
        if (courseUsers == null) {
            return 0;
        }
        return (int) courseUsers.values().stream()
                .filter(role -> "student".equals(role))
                .count();
    }
}
