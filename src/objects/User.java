package objects;

/**
 * an abstract interface to represent a user
 */
public abstract class User {

    /**
     * The name of the user
     */
    protected String name;

    protected final UserType userCategory;



    User(String name, UserType userCategory){
        this.name = name;
        this.userCategory = userCategory;
    }
 
    /**
     * An enumeration to represent either a learning & development user or an employee
     */
    public enum UserType {
    LD,
    Employee
    }


//     /**
//      * Returns the username of the user
//      */
//     String getUsername(){
//         return name;
//     }

//     /*
//     * Returns a user given a username
//     * Throws UnknownUserException if 'username' is not a valid user
//     */
//     abstract User getUser(String username) throws UnknownUserException;

//     /**
//      * Returns the type of the user
//      */
//     UserType getUserType(){
//         return userCategory;
//     }

//     /**
//      * Returns the names of the courses that the user has access to
//      */
//     abstract List<String> getCourseNames();


//     /**
//      * Returns true iff the user has access to the course named 'course'
//      * Note: If 'course' does not exist, hasAccess(course) must return false
//      */
//     abstract boolean hasAccess(String course);


//     /**
//      * Returns the names of the courses that user 'name' is allowed to access
//      * Throws: UnknownUserException if 'name' cannot be found
//      */
//     static List<String> getCourseNames(User user) throws UnknownUserException{
//         try{
//             return user.getCourseNames();
//         }
//         catch(Exception e)
//         {
//             throw new UnknownUserException(user.getUsername());
//         }
//     }

//     /**
//      * Return the course entitled 'courseName' if the user has permission to access it
//      * Throws: InaccessibleCourseException if 'courseName' doesn't exist or if the user
//      * doesn't have permission to accesss it
//      */
//     abstract Course getCourse(String courseName);

// }
}