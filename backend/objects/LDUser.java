package objects;

import java.util.List;

public class LDUser extends User{

    //The name of the user
   
    public LDUser(String name, User.UserType userCategory){
        this.name = name;
        this.userCategory = userCategory;
    }

    @Override
    public User getUser(String username) throws UnknownUserException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<String> getCourseNames() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean hasAccess(String course) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Course getCourse(String courseName) {
        throw new UnsupportedOperationException("Not supported yet.");
    }


}