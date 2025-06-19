package objects;
import java.util.List;
import java.util.Set;



public interface  Course{

    /** 
     * Returns A set of all L&D users who have access to the course
     * Note: the sets returned by get_teachers() and get_students()
     *  must be disjoint and their union must be allUsers
     */
    Set<LDUser> get_teachers();


    /**
     * Returns A set of all student users who have access to the course
     * Note: the sets returned by get_teachers() and get_students()
     *  must be disjoint and their union must be allUsers
     */
    Set<LDUser> get_students();


    /**
     * Returns an ordered array of the modules of the course
     */
    List<Module> get_modules();


    /**
     * Returns the description of a course
     */
    String getDescription();

    /**
     * Returns the progress of user 'user' through this course.It must take into 
     *      account the progress of the user through all the modules. The exact weight of 
     *      each module can be implementation dependent.
     * Throws: UnknownUserException if 'user' does not have access to the course.
     * 
     */
    double getProgress(User user) throws UnknownUserException;

}