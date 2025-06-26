package rebootedmvp;

public interface HasID<T> {

    public Long getId();

    public T create(Long id, String title, String body);
}
