package rebootedmvp;

import java.util.Set;
import java.util.TreeSet;

/**
 * This class is meant to represent a collection of courses. It's primary
 * purpose is to avoid exposure to the user class. That is, if a user needs
 * access to a Course object directly, it must make an API call to roster to
 * first check if it should have access
 */
public class Roster {

    Set<Course> allCourses;

    Roster() {
        allCourses = new TreeSet<>();

    }

    /**
     * Returns whether or not user 'user' has access to the course entitled
     * 'course'. If multiple courses named 'course' exist, this will return
     * whether or not 'user' has access to a random one Throws:
     * InaccessibleCourseException if no course named 'course' exists.
     */
    public boolean userCanAccess(User user, String course) throws InaccessibleCourseException {
        for (Course curCourse : allCourses) {
            if (curCourse.getName().equals(course)) {
                return (curCourse.isStudent(user) || curCourse.isTeacher(user));
            }
        }
        throw new InaccessibleCourseException(user.getUsername(), course);
    }
}
