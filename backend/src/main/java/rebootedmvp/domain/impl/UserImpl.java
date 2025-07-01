package rebootedmvp.domain.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import rebootedmvp.Course;
import rebootedmvp.CourseDoesNotExistException;
import rebootedmvp.InaccessibleCourseException;
import rebootedmvp.User;
import rebootedmvp.service.CourseService;
import rebootedmvp.service.CourseMembershipService;

@Component
public class UserImpl extends User {

    protected Set<String> courseNames;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private CourseMembershipService courseMembershipService;

    public UserImpl() {
        courseNames = new TreeSet<>();
    }

    public UserImpl(String name, User.UserType userCategory) {
        this.name = name;
        this.userCategory = userCategory;
        courseNames = new TreeSet<>();
    }

    @Override
    public List<String> getCourseNames() {
        if (courseMembershipService != null) {
            // Get courses from the membership service based on current user
            try {
                List<rebootedmvp.dto.UserCourseDTO> userCourses = courseMembershipService.getUserCourses(this.name);
                List<String> courseNames = new LinkedList<>();
                for (rebootedmvp.dto.UserCourseDTO course : userCourses) {
                    courseNames.add(course.getName());
                }
                return courseNames;
            } catch (Exception e) {
                // Fall back to the local courseNames set if service fails
                return new LinkedList<>(courseNames);
            }
        }
        return new LinkedList<>(courseNames);
    }

    @Override
    public boolean hasAccess(String courseName) {
        if (courseMembershipService != null) {
            try {
                // Check if user has access to this course by checking user's course list
                List<rebootedmvp.dto.UserCourseDTO> userCourses = courseMembershipService.getUserCourses(this.name);
                for (rebootedmvp.dto.UserCourseDTO userCourse : userCourses) {
                    if (userCourse.getName().equals(courseName)) {
                        return true;
                    }
                }
                return false;
            } catch (Exception e) {
                // Fall back to local courseNames set
                return courseNames.contains(courseName);
            }
        }
        return courseNames.contains(courseName);
    }

    @Override
    public Course getCourse(String courseName) throws InaccessibleCourseException, CourseDoesNotExistException {
        // TODO: Implement proper course lookup once CourseService has database integration
        // For now, check if user has access (which validates the course exists in their list)
        if (!hasAccess(courseName)) {
            throw new CourseDoesNotExistException(courseName);
        }
        
        try {
            // Since we don't have getByTitle implemented yet, throw an exception
            // This will be properly implemented when CourseService is migrated to use repositories
            throw new UnsupportedOperationException("Course lookup by title not yet implemented - requires CourseService database migration");
        } catch (CourseDoesNotExistException | InaccessibleCourseException e) {
            throw e; // Re-throw our specific exceptions
        } catch (Exception e) {
            // Any other exception treated as course not found
            throw new CourseDoesNotExistException(courseName);
        }
    }
    
    /**
     * Add a course to the user's local course set (for backward compatibility)
     */
    public void addCourse(String courseName) {
        courseNames.add(courseName);
    }
    
    /**
     * Remove a course from the user's local course set (for backward compatibility)
     */
    public void removeCourse(String courseName) {
        courseNames.remove(courseName);
    }

}
