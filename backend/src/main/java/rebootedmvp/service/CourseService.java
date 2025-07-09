package rebootedmvp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import rebootedmvp.Course;
import rebootedmvp.CourseMapper;
import rebootedmvp.InfoContainer;
import rebootedmvp.Module;
import rebootedmvp.ModuleMapper;
import rebootedmvp.domain.impl.ModuleEntityImpl;
import rebootedmvp.dto.ModuleDTO;
import rebootedmvp.dto.NewCourseDTO;
import rebootedmvp.dto.NewModuleDTO;
import rebootedmvp.repository.CourseRepository;
import rebootedmvp.repository.ModuleRepository;

@Service
@Transactional
public class CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    /**
     * Returns a list of all modules in all courses
     */
    @Transactional(readOnly = true)
    public List<ModuleDTO> findAll() {
        logger.debug("CourseService.findAll() called - returning all modules");
        return mapToDTO(moduleRepository.findAll()
                .stream()
                .map(ModuleMapper::toDomain)
                .toList());
    }

    /**
     * Returns a list of all modules within the course with given ID
     */
    @Transactional(readOnly = true)
    public List<ModuleDTO> getById(Long courseId) {
        logger.debug("CourseService.getById({}) called - getting modules for course", courseId);

        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }

        return mapToDTO(moduleRepository.findByCourseIdOrderByCreatedAtAsc(courseId)
                .stream()
                .map(ModuleMapper::toDomain)
                .toList());
    }

    /**
     * Returns the specific module within the course
     */
    @Transactional(readOnly = true)
    public ModuleDTO getById(Long courseId, Long moduleId) {
        logger.debug("CourseService.getById({}, {}) called - getting specific module", courseId, moduleId);

        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }

        Optional<Module> moduleOpt = moduleRepository.findById(moduleId).map(ModuleMapper::toDomain);
        if (moduleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }

        Module module = moduleOpt.get();
        if (!module.getCourseId().equals(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Module " + moduleId + " does not belong to course " + courseId);
        }

        return new ModuleDTO(module);
    }

    /**
     * Adds a new module to the specified course
     */
    public Long addNew(Long courseId, NewModuleDTO newModuleDTO) {
        logger.debug("CourseService.addNew({}, {}) called", courseId, newModuleDTO.getTitle());

        if (newModuleDTO.getTitle() == null || newModuleDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title must be supplied in the DTO");
        }

        Optional<Course> courseOpt = courseRepository.findById(courseId).map(CourseMapper::toDomain);
        if (courseOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }

        Course course = courseOpt.get();

        Module module = new ModuleEntityImpl(
                newModuleDTO.getTitle().trim(),
                newModuleDTO.getBody(),
                course);

        Module savedModule = moduleRepository.save(ModuleMapper.toEntity(module));
        logger.info("Created module with ID: {} in course: {}", savedModule.getId(), courseId);
        return savedModule.getId();
    }

    /**
     * Updates a module within a course
     */
    public void update(Long courseId, Long moduleId, NewModuleDTO updateDTO) {
        logger.debug("CourseService.update({}, {}, {}) called", courseId, moduleId, updateDTO.getTitle());

        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }

        Optional<Module> moduleOpt = moduleRepository.findById(moduleId).map(ModuleMapper::toDomain);
        if (moduleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }

        Module module = moduleOpt.get();
        if (!module.getCourseId().equals(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Module " + moduleId + " does not belong to course " + courseId);
        }

        if (updateDTO.getTitle() != null && !updateDTO.getTitle().trim().isEmpty()) {
            module.setTitle(updateDTO.getTitle().trim());
        }
        if (updateDTO.getBody() != null) {
            module.setBody(updateDTO.getBody());
        }

        moduleRepository.save(ModuleMapper.toEntity(module));
        logger.info("Updated module with ID: {} in course: {}", moduleId, courseId);
    }

    /**
     * Deletes a module from a course
     */
    public boolean delete(Long courseId, Long moduleId) {
        logger.debug("CourseService.delete({}, {}) called", courseId, moduleId);

        if (!courseRepository.existsById(courseId)) {
            return false;
        }

        Optional<Module> moduleOpt = moduleRepository.findById(moduleId).map(ModuleMapper::toDomain);
        if (moduleOpt.isEmpty()) {
            return false;
        }

        Module module = moduleOpt.get();
        if (!module.getCourseId().equals(courseId)) {
            return false;
        }

        moduleRepository.deleteById(moduleId);
        logger.info("Deleted module with ID: {} from course: {}", moduleId, courseId);
        return true;
    }

    private static List<ModuleDTO> mapToDTO(List<Module> toMap) {
        return toMap.stream().map(
                elem -> new ModuleDTO(elem)).toList();
    }
}
