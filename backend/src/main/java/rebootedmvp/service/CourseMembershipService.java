package rebootedmvp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import rebootedmvp.domain.impl.CourseEntityImpl;
import rebootedmvp.domain.impl.UserProfileImpl;
import rebootedmvp.dto.CourseUserDTO;
import rebootedmvp.dto.UserCourseDTO;
import rebootedmvp.dto.UserProfileDTO;
import rebootedmvp.repository.CourseRepository;
import rebootedmvp.repository.UserProfileRepository;

@Service
@Transactional
public class CourseMembershipService {

    private static final Logger logger = LoggerFactory.getLogger(CourseMembershipService.class);

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    @Lazy
    private CourseService courseService;

    public boolean addUserToCourse(Long courseId, String userId, String role) {
        logger.debug("Adding user {} to course {} with role {}", userId, courseId, role);
        
        // Find the user
        UserProfileDTO userDTO = userProfileService.findById(userId);
        if (userDTO == null) {
            logger.warn("User not found with ID: {}", userId);
            return false;
        }

        // Find the UserProfileImpl entity
        Optional<UserProfileImpl> userOpt = userProfileRepository.findBySupabaseUserId(userDTO.getId());
        if (userOpt.isEmpty()) {
            logger.warn("UserProfileImpl not found for ID: {}", userId);
            return false;
        }
        UserProfileImpl user = userOpt.get();

        // Find the course
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            logger.warn("Course not found with ID: {}", courseId);
            return false;
        }
        CourseEntityImpl course = courseOpt.get();

        // Add user to appropriate role
        boolean success = false;
        if ("teacher".equals(role)) {
            if (!course.getTeacherProfiles().contains(user)) {
                course.getTeacherProfiles().add(user);
                success = true;
            }
        } else if ("student".equals(role)) {
            if (!course.getStudentProfiles().contains(user)) {
                course.getStudentProfiles().add(user);
                success = true;
            }
        }

        if (success) {
            courseRepository.save(course);
            logger.info("Successfully added user {} to course {} as {}", userId, courseId, role);
        }

        return success;
    }

    public boolean removeUserFromCourse(Long courseId, String userId) {
        logger.debug("Removing user {} from course {}", userId, courseId);

        // Find the user
        UserProfileDTO userDTO = userProfileService.findById(userId);
        if (userDTO == null) {
            logger.warn("User not found with ID: {}", userId);
            return false;
        }

        // Find the UserProfileImpl entity
        Optional<UserProfileImpl> userOpt = userProfileRepository.findBySupabaseUserId(userDTO.getId());
        if (userOpt.isEmpty()) {
            logger.warn("UserProfileImpl not found for ID: {}", userId);
            return false;
        }
        UserProfileImpl user = userOpt.get();

        // Find the course
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            logger.warn("Course not found with ID: {}", courseId);
            return false;
        }
        CourseEntityImpl course = courseOpt.get();

        // Remove user from both roles
        boolean removedAsTeacher = course.getTeacherProfiles().remove(user);
        boolean removedAsStudent = course.getStudentProfiles().remove(user);
        boolean success = removedAsTeacher || removedAsStudent;

        if (success) {
            courseRepository.save(course);
            logger.info("Successfully removed user {} from course {}", userId, courseId);
        }

        return success;
    }

    @Transactional(readOnly = true)
    public List<CourseUserDTO> getCourseUsers(Long courseId) {
        logger.debug("Getting users for course {}", courseId);

        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            logger.warn("Course not found with ID: {}", courseId);
            return List.of();
        }

        CourseEntityImpl course = courseOpt.get();
        List<CourseUserDTO> result = new ArrayList<>();

        // Add teachers
        for (UserProfileImpl teacher : course.getTeacherProfiles()) {
            result.add(new CourseUserDTO(courseId, teacher.getSupabaseUserId(), "teacher",
                    teacher.getUsername(), teacher.getFullName()));
        }

        // Add students
        for (UserProfileImpl student : course.getStudentProfiles()) {
            result.add(new CourseUserDTO(courseId, student.getSupabaseUserId(), "student",
                    student.getUsername(), student.getFullName()));
        }

        logger.debug("Found {} users for course {}", result.size(), courseId);
        return result;
    }

    @Transactional(readOnly = true)
    public List<UserCourseDTO> getUserCourses(String userId) {
        logger.info("===== CourseMembershipService.getUserCourses() START =====");
        logger.info("Input userId: '{}'", userId);
        
        try {
            // Handle both username and UUID-based lookups
            UserProfileImpl user = null;
            
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
                // Found by username, now find the entity
                Optional<UserProfileImpl> userOpt = userProfileRepository.findBySupabaseUserId(userByUsername.getId());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                    logger.info("User '{}' found as username, mapped to entity ID: '{}'", userId, user.getId());
                }
            } else {
                // Try to find by ID directly
                Optional<UserProfileImpl> userOpt = userProfileRepository.findBySupabaseUserId(userId);
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                    logger.info("User '{}' found by ID, entity ID: '{}'", userId, user.getId());
                }
            }

            if (user == null) {
                logger.warn("User not found: {}", userId);
                return List.of();
            }

            logger.debug("Step 2: Finding courses for user entity ID: '{}'", user.getId());
            
            // Find courses where user is either teacher or student
            List<CourseEntityImpl> courses = courseRepository.findCoursesByUserId(user.getId());
            
            List<UserCourseDTO> result = new ArrayList<>();
            for (CourseEntityImpl course : courses) {
                String role;
                if (course.getTeacherProfiles().contains(user)) {
                    role = "teacher";
                } else if (course.getStudentProfiles().contains(user)) {
                    role = "student";
                } else {
                    continue; // Skip if user not found in either role (shouldn't happen)
                }

                UserCourseDTO courseDTO = new UserCourseDTO(course.getId(), course.getTitle(), 
                                               course.getBody(), role);
                result.add(courseDTO);
                logger.debug("Added course: {} with role: {}", course.getTitle(), role);
            }
            
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
        logger.debug("Adding {} users to course {} with role {}", usernames.size(), courseId, role);

        // Find all users first
        List<UserProfileDTO> userDTOs = userProfileService.findByUsernames(usernames);
        if (userDTOs.size() != usernames.size()) {
            logger.warn("Some users not found. Expected: {}, Found: {}", usernames.size(), userDTOs.size());
            return false; // Some users don't exist
        }

        // Find the course
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            logger.warn("Course not found with ID: {}", courseId);
            return false;
        }
        CourseEntityImpl course = courseOpt.get();

        // Find all UserProfileImpl entities
        List<UserProfileImpl> users = new ArrayList<>();
        for (UserProfileDTO userDTO : userDTOs) {
            Optional<UserProfileImpl> userOpt = userProfileRepository.findBySupabaseUserId(userDTO.getId());
            if (userOpt.isEmpty()) {
                logger.warn("UserProfileImpl not found for ID: {}", userDTO.getId());
                return false;
            }
            users.add(userOpt.get());
        }

        // Add users to appropriate role
        if ("teacher".equals(role)) {
            course.getTeacherProfiles().addAll(users);
        } else if ("student".equals(role)) {
            course.getStudentProfiles().addAll(users);
        } else {
            logger.warn("Invalid role: {}", role);
            return false;
        }

        courseRepository.save(course);
        logger.info("Successfully added {} users to course {} as {}", users.size(), courseId, role);
        return true;
    }

    @Transactional(readOnly = true)
    public int getTeacherCount(Long courseId) {
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return 0;
        }
        return courseOpt.get().getTeacherProfiles().size();
    }

    @Transactional(readOnly = true)
    public int getStudentCount(Long courseId) {
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return 0;
        }
        return courseOpt.get().getStudentProfiles().size();
    }
}
