package rebootedmvp.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import rebootedmvp.dto.CourseUserDTO;
import rebootedmvp.dto.UserCourseDTO;
import rebootedmvp.dto.UserProfileDTO;

@Service
public class CourseMembershipService {

    private static final Logger logger = LoggerFactory.getLogger(CourseMembershipService.class);

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
        logger.info("===== CourseMembershipService.getUserCourses() START =====");
        logger.info("Input userId: '{}'", userId);
        logger.debug("Current courseMemberships map size: {}", courseMemberships.size());
        logger.debug("Current courseMemberships content: {}", courseMemberships);
        
        try {
            // Handle both username and UUID-based lookups
            final String actualUserId;
            
            logger.debug("Step 1: Checking if userId is a username...");
            UserProfileDTO userByUsername = null;
            try {
                userByUsername = userProfileService.findByUsername(userId);
                logger.debug("findByUsername('{}') result: {}", userId, userByUsername);
            } catch (Exception e) {
                logger.error("Error calling userProfileService.findByUsername('{}'): {}", userId, e.getMessage(), e);
                throw e;
            }
            
            if (userByUsername != null) {
                actualUserId = userByUsername.getId();
                logger.info("User '{}' found as username, mapped to ID: '{}'", userId, actualUserId);
            } else {
                actualUserId = userId;
                logger.info("User '{}' not found as username, using as-is for ID lookup", userId);
            }
            
            logger.debug("Step 2: Filtering course memberships for actualUserId: '{}'", actualUserId);
            
            List<UserCourseDTO> result = courseMemberships.entrySet().stream()
                    .filter(entry -> {
                        boolean contains = entry.getValue().containsKey(actualUserId);
                        logger.debug("Course {} contains user '{}': {}", entry.getKey(), actualUserId, contains);
                        return contains;
                    })
                    .map(entry -> {
                        Long courseId = entry.getKey();
                        String role = entry.getValue().get(actualUserId);
                        
                        logger.debug("Processing course {} with role '{}' for user '{}'", courseId, role, actualUserId);
                        
                        try {
                            // Create a basic course representation since CourseService.getById 
                            // returns List<Module> not CourseDTO
                            UserCourseDTO courseDTO = new UserCourseDTO(courseId, "Course " + courseId, 
                                                           "Course description", role);
                            logger.debug("Created UserCourseDTO: {}", courseDTO);
                            return courseDTO;
                        } catch (Exception e) {
                            logger.error("Error creating UserCourseDTO for course {} and user '{}': {}", 
                                       courseId, actualUserId, e.getMessage(), e);
                            return null;
                        }
                    })
                    .filter(course -> {
                        boolean notNull = course != null;
                        logger.debug("Course filtering - not null: {}", notNull);
                        return notNull;
                    })
                    .collect(Collectors.toList());
            
            logger.info("===== CourseMembershipService.getUserCourses() SUCCESS =====");
            logger.info("Returning {} courses for user '{}'", result.size(), userId);
            logger.debug("Final result: {}", result);
            
            return result;
            
        } catch (Exception e) {
            logger.error("===== CourseMembershipService.getUserCourses() ERROR =====");
            logger.error("Error processing getUserCourses for user '{}': {}", userId, e.getMessage(), e);
            throw e;
        }
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
