package rebootedmvp;

import java.util.List;

/**
 * This is a super-interface for all groupings of information (Roster, Course,
 * Module). That is, the interface for each must extend this. The R datatype is
 * the type below. For example, in the Course interface, the type Module should
 * be passed in.
 */
public interface InfoContainer<R> extends HasID {

    public List<R> getAll();

    public void addSub(Long id, R smallerGroup);

    public boolean removeSub(Long removeId);

    public R create(Long id, String title, String body);
}
