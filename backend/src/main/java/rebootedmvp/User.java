package rebootedmvp;

import java.util.List;

/**
 * An abstract interface to represent a user, which can be either a learning and
 * development professional or a different employee.
 */
public abstract class User {

    protected String name;

    protected UserType userCategory;

    /**
     * An enumeration to represent either a learning & development user or an
     * employee
     */
    public enum UserType {
        LDUser,
        EmployeeUser
    }

    /**
     * Returns the username of the user
     */
    public String getUsername() {
        return name;
    }

    /**
     * Returns the type of the user
     */
    public UserType getUserType() {
        return userCategory;
    }

    /**
     * Returns the names of the courses that the user has access to
     */
    public abstract List<String> getCourseNames();

    /**
     * Returns true iff the user has access to the course named 'course' Note:
     * If 'course' does not exist, hasAccess(course) must return false
     */
    public abstract boolean hasAccess(String course);

    /**
     * Return the course entitled 'courseName' if the user has permission to
     * access it Throws: InaccessibleCourseException if the user doesn't have
     * permission to access it. Throws: CourseDoesNotExistException if
     * 'courseName' doesn't exist
     */
    public abstract Course getCourse(String courseName) throws InaccessibleCourseException, CourseDoesNotExistException;

    /**
     * Returns the progress of the user through course entitled 'courseName'.
     * Throws: InaccessibleCourseException if the user does not have access to
     * the course.
     */
    public double getProgress(String courseName) throws InaccessibleCourseException {
        return getCourse(courseName).getProgress(this);
    }

}
