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
import rebootedmvp.domain.impl.CourseEntityImpl;
import rebootedmvp.dto.NewCourseDTO;
import rebootedmvp.dto.NewRosterDTO;
import rebootedmvp.repository.CourseRepository;

@Service
@Transactional
public class RosterService {

    private static final Logger logger = LoggerFactory.getLogger(RosterService.class);

    @Autowired
    private CourseRepository courseRepository;

    /**
     * Creates a new roster (for API compatibility - returns a constant ID)
     * In the database-backed implementation, this is just a no-op since we manage courses directly
     */
    public Long addToHigh(NewRosterDTO newData, java.util.function.Function<NewRosterDTO, Object> constructor) {
        logger.debug("RosterService.addToHigh() called - roster concept is simplified in database implementation");
        // Return a constant roster ID since we're managing courses directly
        return 1L;
    }

    /**
     * Returns a list of all courses (what was previously "all courses in all rosters")
     */
    @Transactional(readOnly = true)
    public List<Course> findAll() {
        logger.debug("RosterService.findAll() called - returning all courses");
        return courseRepository.findAll().stream()
                .map(this::convertToCourse)
                .toList();
    }

    /**
     * Returns a list of all courses (roster ID is ignored since we manage courses directly)
     */
    @Transactional(readOnly = true)
    public List<Course> getById(Long rosterId) {
        logger.debug("RosterService.getById({}) called - returning all courses (roster ID ignored)", rosterId);
        return findAll();
    }

    /**
     * Returns a specific course (roster ID is ignored, course ID is used directly)
     */
    @Transactional(readOnly = true)
    public Course getById(Long rosterId, Long courseId) {
        logger.debug("RosterService.getById({}, {}) called - getting specific course", rosterId, courseId);
        
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }
        
        return convertToCourse(courseOpt.get());
    }

    /**
     * Adds a new course (roster ID is ignored since we manage courses directly)
     */
    public Long addNew(Long rosterId, NewCourseDTO newCourseDTO) {
        logger.debug("RosterService.addNew({}, {}) called", rosterId, newCourseDTO.getTitle());
        
        if (newCourseDTO.getTitle() == null || newCourseDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title must be supplied in the DTO");
        }

        CourseEntityImpl course = new CourseEntityImpl(
            newCourseDTO.getTitle().trim(),
            newCourseDTO.getBody()
        );
        
        CourseEntityImpl savedCourse = courseRepository.save(course);
        logger.info("Created course with ID: {}", savedCourse.getId());
        return savedCourse.getId();
    }

    /**
     * Updates a course (roster ID is ignored, course ID is used directly)
     */
    public void update(Long rosterId, Long courseId, NewCourseDTO updateDTO) {
        logger.debug("RosterService.update({}, {}, {}) called", rosterId, courseId, updateDTO.getTitle());
        
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + courseId);
        }
        
        CourseEntityImpl course = courseOpt.get();

        if (updateDTO.getTitle() != null && !updateDTO.getTitle().trim().isEmpty()) {
            course.setTitle(updateDTO.getTitle().trim());
        }
        if (updateDTO.getBody() != null) {
            course.setBody(updateDTO.getBody());
        }
        
        courseRepository.save(course);
        logger.info("Updated course with ID: {}", courseId);
    }

    /**
     * Deletes a course (roster ID is ignored, course ID is used directly)
     */
    public boolean delete(Long rosterId, Long courseId) {
        logger.debug("RosterService.delete({}, {}) called", rosterId, courseId);
        
        if (courseRepository.existsById(courseId)) {
            courseRepository.deleteById(courseId);
            logger.info("Deleted course with ID: {}", courseId);
            return true;
        }
        return false;
    }

    private Course convertToCourse(CourseEntityImpl courseEntity) {
        // Convert CourseEntityImpl to Course interface
        // Note: This assumes CourseEntityImpl already implements Course interface
        return courseEntity;
    }
}
