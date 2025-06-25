package rebootedmvp.domain.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import rebootedmvp.Course;
import rebootedmvp.CourseDoesNotExistException;
import rebootedmvp.InaccessibleCourseException;
import rebootedmvp.User;

public class UserImpl extends User {

    protected Set<String> courseNames;

    public UserImpl(String name, User.UserType userCategory) {
        this.name = name;
        this.userCategory = userCategory;
        courseNames = new TreeSet<>();
    }

    @Override
    public List<String> getCourseNames() {
        return new LinkedList<>(courseNames);
    }

    @Override
    public boolean hasAccess(String course) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Course getCourse(String courseName) throws InaccessibleCourseException, CourseDoesNotExistException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
