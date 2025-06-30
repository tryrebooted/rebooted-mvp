package rebootedmvp.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import rebootedmvp.HasID;
import rebootedmvp.InfoContainer;
import rebootedmvp.dto.NewDTO;

/**
 * This is an interface for a service object. It denotes the meaningful actions
 * that can be taken from this point. 'T' should be the type of the highest
 * level of abstraction that the implementation might have to consider. For
 * example, T in CourseService should be type Course. 'R' should be the type one
 * level lower than T. For example, if T is of type Course then 'R' should be of
 * type Module. Type 'Q' is the type of the new data DTO of type 'R'. For
 * example, if type 'T' is Course and R is 'Module', then 'Q' should be
 * 'NewModuleDTO'. R should be the new DTO type of type T.
 */
public abstract class ServiceType<T extends InfoContainer<K>, K extends HasID, Q extends NewDTO, R extends NewDTO> {

    private final Map<Long, T> datas = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    /**
     * Returns a list of all the elements within all of the T's. For example, in
     * CourseService, this should return a list of every module in every course
     */
    public List<K> findAll() {
        Collection<T> data = datas.values();

        return data.stream()
                .map((var elem) -> {
                    return elem.getAll();
                }
                ).flatMap(List::stream).toList();
    }

    /**
     * Returns a list of all the elements within the 'T' with id 'id'. Throws:
     * ResponseStatusException if no course can be found with that id.
     */
    public List<K> getById(Long id) {
        T data = datas.get(id);
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nothing was found with that id");
        }
        return data.getAll();
    }

    /**
     * Returns the element within the 'T' with id 'id1' that has id 'id2'.
     * Throws: ResponseStatusException if no course can be found with that id.
     */
    public K getById(Long id1, Long id2) {
        T data = datas.get(id1);
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nothing was found with that id");
        }
        return data.getAll()
                .stream()
                .filter(elem -> Objects.equals(elem.getId(), id2))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nothing was found with that id"));
    }

    public Long addNew(Long id, Q newData) {
        if (newData.getTitle() == null || newData.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title must be supplied in the DTO");
        }

        Long newId = idGenerator.getAndIncrement();
        T highLevel = datas.get(id);

        K smallerGroup = highLevel.create(newId, newData.getTitle(), newData.getBody());
        highLevel.addSub(newId, smallerGroup);

        return newId;
    }

    public Long addToHigh(R newData, Function<R, T> constructor) {
        if (newData.getTitle() == null || newData.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title must be supplied in the DTO");
        }

        Long newId = idGenerator.getAndIncrement();
        T newObject = constructor.apply(newData); // 👈 uses lambda to create the object
        datas.put(newId, newObject);
        return newId;
    }

    public void update(Long highId, Long lowId, Q updateDTO) {
        T data = datas.get(highId);
        K toUpdate = data.getAll()
                .stream()
                .filter(elem -> Objects.equals(elem.getId(), lowId))
                .findAny()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nothing was found with that id"));
        if (toUpdate == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nothing was found with that id");
        }

        if (updateDTO.getTitle() != null && !updateDTO.getTitle().trim().isEmpty()) {
            toUpdate.setTitle(updateDTO.getTitle().trim());
        }
        if (updateDTO.getBody() != null) {
            toUpdate.setBody(updateDTO.getBody());
        }
    }

    public boolean delete(Long highId, Long lowId) {
        T data = datas.get(highId);
        return data.removeSub(lowId);
    }

    // /**
    //  * Creates an instance of type T with id 'id', title 'title', and
    //  * body/metadata 'body'
    //  */
    // public abstract T create(Long id, String title, String body);
}
