package rebootedmvp;

import java.util.List;

public interface Module {

    /**
     * Returns a double in [0,1] that signifies how completed a module is for
     * user 'user' The weighting of specific pieces of content is up to the
     * implementer but it should increase with every completed content block or
     * question answered correctly
     */
    double getProgress(User user) throws UnknownUserException;

    /**
     * Returns the weight of this module for user 'user'. Weight is the metric
     * by which a course must combine progress between modules.
     */
    double getWeight(User user) throws UnknownUserException;

    /**
     * Returns the content in the module, in the order that it should appear to
     * the user
     */
    List<Content> getContent();

}
