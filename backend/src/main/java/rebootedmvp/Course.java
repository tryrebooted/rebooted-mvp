package rebootedmvp;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public interface Course extends InfoContainer<Module> {

    /**
     * Returns A set of all L&D users who have access to the course Note: the
     * sets returned by get_teachers() and get_students() must be disjoint and
     * their union must be allUsers
     */
    Set<User> get_teachers();

    /**
     * Returns A set of all student users who have access to the course Note:
     * the sets returned by get_teachers() and get_students() must be disjoint
     * and their union must be allUsers
     */
    Set<User> get_students();

    /**
     * Returns an ordered array of the modules of the course
     */
    List<Module> get_modules();

    /**
     * Returns the progress of user 'user' through this course. It must take
     * into account the progress of the user through all the modules
     * proportional to each module's weight. Example: If module A has weight 17
     * and is 80% complete and module B has weight 12 and is 50% complete then
     * getProgress must return within a rounding error of (.8 * 17 + .5 * 12)/27
     * or ~.72592 Throws: UnknownUserException if 'user' does not have access to
     * the course.
     *
     */
    double getProgress(User user) throws UnknownUserException;

    /**
     * Returns an ArrayList of ArrayLists of Booleans where each Boolean
     * represents whether a specific content has been completed. The outer
     * ArrayList is the module and the inner ArrayList is the content within
     * that module. Example: getCompletion(user)[0][2] is whether the 2nd
     * content of the 0th module has been completed. Throws:
     * UnknownUserException if 'user' does not have access to the course.
     */
    ArrayList<ArrayList<Boolean>> getCompletion(User user) throws UnknownUserException;

    /**
     * Adds the user 'user' as a student of this course. If user was already a
     * student, this method does nothing. If 'user' is successfully added as a
     * student return true. Otherwise return false. Requires: user is not null
     * Note: if 'user' is a teacher, they will not be added as a student
     */
    boolean addStudent(User user);

    /**
     * Removes student user 'user' from being a student. Returns true if done
     * successfully Returns false if 'user' is not a student of this course and
     * the student collection remains unchanged
     */
    boolean removeStudent(User user);

    /**
     * Returns whether or not 'user' is a student in this course
     */
    boolean isStudent(User user);

    /**
     * Adds the user 'user' as a teacher of this course. If user was already a
     * teacher, this method does nothing. If 'user' is successfully added as a
     * teacher return true. Otherwise return false. Requires: user is not null
     * Note: if 'user' is a student, they will not be added as a teacher
     */
    boolean addTeacher(User user);

    /**
     * Removes teacher user 'user' from being a teacher. Returns true if done
     * successfully Returns false if 'user' is not a teacher of this course and
     * the teacher collection remains unchanged
     */
    boolean removeTeacher(User user);

    /**
     * Returns whether or not 'user' is a teacher in this course
     */
    boolean isTeacher(User user);

}
