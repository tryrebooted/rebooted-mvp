package rebootedmvp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * This is the data transfer object for the roster.
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
