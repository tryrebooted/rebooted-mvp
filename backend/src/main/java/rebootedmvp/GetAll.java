package rebootedmvp;

import java.util.List;

public interface GetAll<R> extends HasID<R> {

    public List<R> getAll();

    // public K createDTO(R original);
    public String getTitle();

    public void setTitle(String newTitle);

    public String getBody();

    public void setBody(String newBody);

    public void addSub(R smallerGroup);

}
