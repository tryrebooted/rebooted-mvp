package rebootedmvp;

import java.util.List;

/**
 * This is a super-interface for all groupings of information (Roster, Course,
 * Module). That is, the interface for each must extend this. The R datatype is
 * the type below. For example, in the Course interface, the type Module should
 * be passed in. In such a senario, Course will be referred to as the higher
 * data type and Module as the lower.
 */
public interface InfoContainer<R> extends HasID {

    /**
     * Returns a list of all the subelements of this collection. For example, if
     * type 'R' is module (and hence courses are the higher level class) then
     * getAll() is a list of the modules in that specific course.
     */
    public List<R> getAll();

    /**
     * Adds a lower element to the higher collection.
     * 
     * @param smallerGroup - the lower element to add
     */
    public void addSub(R smallerGroup);

    /**
     * Removes the element with id 'removeId'
     * 
     * @param removeId - The id of the element to be removed
     * @return - A boolean denoting whether or not the removal was successful (i.e.
     *         if an element existed with if 'removeId')
     */
    public boolean removeSub(Long removeId);

    /**
     * Creates an instance of the lower element
     * 
     * @param id    - The id of the new element
     * @param title - The title of the new element
     * @param body  - The body data of the new element
     * @return - The new element
     */
    public R create(Long id, String title, String body);
}
