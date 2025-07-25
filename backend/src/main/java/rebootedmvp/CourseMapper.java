package rebootedmvp;

import org.springframework.stereotype.Component;

import rebootedmvp.domain.impl.CourseEntityImpl;

@Component
public class CourseMapper {
    public static Course toDomain(CourseEntityImpl entity) {
        return entity;
    }

    public static CourseEntityImpl toEntity(Course domain) {
        CourseEntityImpl entity = new CourseEntityImpl(domain.getTitle(), domain.getBody());
        entity.setId(domain.getId());
        entity.setTitle(domain.getTitle());
        entity.setBody(domain.getBody());
        entity.setTeachers(domain.getTeachers());
        entity.setStudents(domain.getStudents());
        return entity;
    }
}