package rebootedmvp;

import java.util.HashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * This class is meant to represent a collection of courses. It's primary
 * purpose is to avoid exposure to the user class. That is, if a user needs
 * access to a Course object directly, it must make an API call to roster to
 * first check if it should have access
 */
public class Roster {

    HashMap<Long, Course> allCourses;

    Roster() {
        allCourses = new HashMap<>();

    }

    /**
     * Returns whether or not user 'user' has access to the course entitled
     * 'course'. If multiple courses named 'course' exist, this will return
     * whether or not 'user' has access to a random one Throws:
     * CourseDoesNotExistException if no course named 'course' exists.
     */
    public boolean userCanAccess(User user, Long course) throws CourseDoesNotExistException {
        Course curCourse = allCourses.get(course);
        try {
            return (curCourse.isStudent(user) || curCourse.isTeacher(user));
        } catch (Exception e) {
            throw new CourseDoesNotExistException(course);
        }
    }

    public Long generateKey() {
        final AtomicLong idGenerator = new AtomicLong(1);
        return idGenerator.getAndIncrement();
    }

    public Long addCourse(Course c) {
        Long newKey;
        while (true) {
            newKey = generateKey();
            if (!allCourses.containsKey(newKey)) {
                allCourses.put(generateKey(), c);
                break;
            }
        }
        return newKey;
    }
}
