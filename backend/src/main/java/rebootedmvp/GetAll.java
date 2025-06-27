package rebootedmvp;

import java.util.List;

public interface GetAll<R> extends HasID {

    public List<R> getAll();

    public void addSub(Long id, R smallerGroup);

    public boolean removeSub(Long removeId);

    public R create(Long id, String title, String body);
}
