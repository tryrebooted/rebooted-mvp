package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.Course;
import rebootedmvp.Module;
import rebootedmvp.domain.impl.CourseImpl;
import rebootedmvp.dto.NewModuleDTO;

@Service
public class CourseService extends ServiceType<Course, Module, NewModuleDTO> {

    @Override
    public Course create(Long id, String title, String body) {
        return new CourseImpl(id, title, body);
    }

}
