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

import rebootedmvp.Module;
import rebootedmvp.domain.impl.CourseEntityImpl;
import rebootedmvp.domain.impl.ModuleEntityImpl;
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
    public List<Module> findAll() {
        logger.debug("CourseService.findAll() called - returning all modules");
        return moduleRepository.findAll().stream()
                .map(this::convertToModule)
                .toList();
    }

    /**
     * Returns a list of all modules within the course with given ID
     */
    @Transactional(readOnly = true)
    public List<Module> getById(Long courseId) {
        logger.debug("CourseService.getById({}) called - getting modules for course", courseId);
        
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }
        
        return moduleRepository.findByCourse_IdOrderByCreatedAtAsc(courseId).stream()
                .map(this::convertToModule)
                .toList();
    }

    /**
     * Returns the specific module within the course
     */
    @Transactional(readOnly = true)
    public Module getById(Long courseId, Long moduleId) {
        logger.debug("CourseService.getById({}, {}) called - getting specific module", courseId, moduleId);
        
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }
        
        Optional<ModuleEntityImpl> moduleOpt = moduleRepository.findById(moduleId);
        if (moduleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }
        
        ModuleEntityImpl module = moduleOpt.get();
        if (!module.getCourseId().equals(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module " + moduleId + " does not belong to course " + courseId);
        }
        
        return convertToModule(module);
    }

    /**
     * Adds a new module to the specified course
     */
    public Long addNew(Long courseId, NewModuleDTO newModuleDTO) {
        logger.debug("CourseService.addNew({}, {}) called", courseId, newModuleDTO.getTitle());
        
        if (newModuleDTO.getTitle() == null || newModuleDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title must be supplied in the DTO");
        }

        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }
        
        CourseEntityImpl course = courseOpt.get();
        
        ModuleEntityImpl module = new ModuleEntityImpl(
            newModuleDTO.getTitle().trim(),
            newModuleDTO.getBody(),
            course
        );
        
        ModuleEntityImpl savedModule = moduleRepository.save(module);
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
        
        Optional<ModuleEntityImpl> moduleOpt = moduleRepository.findById(moduleId);
        if (moduleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }
        
        ModuleEntityImpl module = moduleOpt.get();
        if (!module.getCourseId().equals(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module " + moduleId + " does not belong to course " + courseId);
        }

        if (updateDTO.getTitle() != null && !updateDTO.getTitle().trim().isEmpty()) {
            module.setTitle(updateDTO.getTitle().trim());
        }
        if (updateDTO.getBody() != null) {
            module.setBody(updateDTO.getBody());
        }
        
        moduleRepository.save(module);
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
        
        Optional<ModuleEntityImpl> moduleOpt = moduleRepository.findById(moduleId);
        if (moduleOpt.isEmpty()) {
            return false;
        }
        
        ModuleEntityImpl module = moduleOpt.get();
        if (!module.getCourseId().equals(courseId)) {
            return false;
        }
        
        moduleRepository.deleteById(moduleId);
        logger.info("Deleted module with ID: {} from course: {}", moduleId, courseId);
        return true;
    }

    private Module convertToModule(ModuleEntityImpl moduleEntity) {
        // Convert ModuleEntityImpl to Module interface
        // Note: This assumes ModuleEntityImpl already implements Module interface
        return moduleEntity;
    }
}
