package rebootedmvp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * This is the data transfer object for the roster. It should only ever send
 * back information in relation to a specific user. That is, the names of the
 * courses returned are only the courses that a specifc user has access to, not
 * all courses.
 */
public class RosterDTO {

    private final List<String> courseNames;
    private final String userName;

    public RosterDTO(List<String> courseNames, String userName) {
        this.courseNames = courseNames;
        this.userName = userName;
    }

    public String getUsername() {
        return userName;
    }

    public List<String> getCourses() {
        return new ArrayList<>(courseNames);
    }

}
