package rebootedmvp;

import java.util.List;

public interface Module extends InfoContainer<Content> {

    /**
     * Returns the weight of this module for user 'user'. Weight is the metric
     * by which a course must combine progress between modules
     */
    double getWeight();

    /**
     * Returns the content in the module, in the order that it should appear to
     * the user
     */
    List<Content> getContent();

    /**
     * Returns the Id of the course that this module belongs to
     */
    Long getCourseId();

}
