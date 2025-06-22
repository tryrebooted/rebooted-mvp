package rebootedmvp.service;

import org.springframework.stereotype.Service;
import rebootedmvp.domain.impl.CourseImpl;
import rebootedmvp.dto.CourseDTO;
import rebootedmvp.dto.NewCourseDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CourseService {
    private final Map<Long, CourseImpl> courses = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public List<CourseDTO> findAll() {
        return courses.values().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public CourseDTO findById(Long id) {
        CourseImpl course = courses.get(id);
        if (course == null) {
            return null;
        }
        return convertToDTO(course);
    }

    public CourseDTO create(NewCourseDTO newCourseDTO) {
        if (newCourseDTO.getName() == null || newCourseDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Course name cannot be empty");
        }

        Long id = idGenerator.getAndIncrement();
        CourseImpl course = new CourseImpl(id, newCourseDTO.getName().trim(), newCourseDTO.getDescription());
        courses.put(id, course);
        
        return convertToDTO(course);
    }

    public CourseDTO update(Long id, NewCourseDTO updateCourseDTO) {
        CourseImpl course = courses.get(id);
        if (course == null) {
            return null;
        }

        if (updateCourseDTO.getName() != null && !updateCourseDTO.getName().trim().isEmpty()) {
            course.setName(updateCourseDTO.getName().trim());
        }
        if (updateCourseDTO.getDescription() != null) {
            course.setDescription(updateCourseDTO.getDescription());
        }

        return convertToDTO(course);
    }

    public boolean delete(Long id) {
        return courses.remove(id) != null;
    }

    private CourseDTO convertToDTO(CourseImpl course) {
        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.get_teachers().size(),
                course.get_students().size(),
                course.get_modules().size()
        );
    }
}