package rebootedmvp;

import java.util.List;

public interface Module {

    /**
     * Returns the weight of this module for user 'user'. Weight is the metric
     * by which a course must combine progress between modules.
     */
    double getWeight() throws UnknownUserException;

    /**
     * Returns the content in the module, in the order that it should appear to
     * the user
     */
    List<Content> getContent();

}
