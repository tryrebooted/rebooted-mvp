package rebootedmvp;

/**
 * HasID are the actions that can be taken at every level of the information
 * abstraction.In particular, at the level below the one currently beign
 * considered. For example, given a course, these are the actions guaranteed to
 * exist for a module. As a consequence, every abstraction (Content, Module,
 * Course, Roster) must implement them.
 */
public interface HasID {

    public Long getId();

    public String getTitle();

    public void setTitle(String newTitle);

    public String getBody();

    public void setBody(String newBody);

}
