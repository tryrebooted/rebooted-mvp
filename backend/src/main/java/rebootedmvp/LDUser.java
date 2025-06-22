package rebootedmvp;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * This User represents a learning and development professional.
 * They will have the permissions to build/edit courses
 */
public class LDUser extends User{

    protected Set<String> courses;
   
    public LDUser(String name, User.UserType userCategory){
        this.name = name;
        this.userCategory = userCategory;
        courses = new TreeSet<>();
    }

  
    @Override
    public List<String> getCourseNames() {
        return new LinkedList<>(courses);
    }

    @Override
    public boolean hasAccess(String course) {
        return courses.contains(course);
    }

    @Override
    public Course getCourse(String courseName) {
        throw new UnsupportedOperationException("Not supported yet.");
    }


}