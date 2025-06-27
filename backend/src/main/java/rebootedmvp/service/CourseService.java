package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.Course;
import rebootedmvp.Module;
import rebootedmvp.dto.NewCourseDTO;
import rebootedmvp.dto.NewModuleDTO;

@Service
public class CourseService extends ServiceType<Course, Module, NewModuleDTO, NewCourseDTO> {

}
