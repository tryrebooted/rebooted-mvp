package rebootedmvp;

/**
 * This Exception is to be thrown in the event that a course that is trying to
 * be accessed does not exist
 */
public class CourseDoesNotExistException extends RuntimeException {

    public CourseDoesNotExistException(Long courseID) {
        super("There is no course with an ID of " + courseID.toString());
    }

    public CourseDoesNotExistException(String courseName) {
        super("There is no course named " + courseName);
    }
}
