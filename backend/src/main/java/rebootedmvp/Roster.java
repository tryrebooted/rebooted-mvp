package rebootedmvp;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import rebootedmvp.domain.impl.CourseEntityImpl;
import rebootedmvp.domain.impl.UserProfileImpl;
import rebootedmvp.dto.NewRosterDTO;
import rebootedmvp.repository.CourseRepository;
import rebootedmvp.repository.UserProfileRepository;

/**
 * This class is meant to represent a collection of courses. It's primary
 * purpose is to avoid exposure to the user class. That is, if a user needs
 * access to a Course object directly, it must make an API call to roster to
 * first check if it should have access
 * 
 * Now uses database storage instead of in-memory HashMap.
 */
@Component
public class Roster implements InfoContainer<Course> {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;

    private String title;
    private String body;
    private Long id;

    // Default constructor for Spring
    public Roster() {}

    public Roster(NewRosterDTO newData) {
        this.title = newData.getTitle();
        this.body = newData.getBody();
    }

    public Roster(Long id, String title, String body) {
        this.id = id;
        this.title = title;
        this.body = body;
    }

    /**
     * Returns whether or not user 'user' has access to the course with the given ID.
     * Throws: CourseDoesNotExistException if no course with the given ID exists.
     */
    public boolean userCanAccess(User user, Long courseId) throws CourseDoesNotExistException {
        Optional<CourseEntityImpl> courseOpt = courseRepository.findById(courseId);
        if (!courseOpt.isPresent()) {
            throw new CourseDoesNotExistException(courseId);
        }
        
        Course course = courseOpt.get();
        try {
            return (course.isStudent(user) || course.isTeacher(user));
        } catch (Exception e) {
            throw new CourseDoesNotExistException(courseId);
        }
    }

    /**
     * Check if a user has access to a course using UserProfileImpl
     */
    public boolean userCanAccess(UserProfileImpl userProfile, Long courseId) throws CourseDoesNotExistException {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseDoesNotExistException(courseId);
        }
        
        boolean isTeacher = courseRepository.isUserTeacherOfCourse(courseId, userProfile.getId());
        boolean isStudent = courseRepository.isUserStudentOfCourse(courseId, userProfile.getId());
        
        return isTeacher || isStudent;
    }

    @Override
    public void addSub(Long ignored, Course course) {
        // ID is ignored since database will auto-generate
        if (course instanceof CourseEntityImpl) {
            courseRepository.save((CourseEntityImpl) course);
        } else {
            // Convert from interface to entity if needed
            CourseEntityImpl courseEntity = new CourseEntityImpl(course.getTitle(), course.getBody());
            courseRepository.save(courseEntity);
        }
    }

    @Override
    public List<Course> getAll() {
        List<CourseEntityImpl> courseEntities = courseRepository.findAll();
        return List.copyOf(courseEntities);
    }

    /**
     * Get all courses with associations (teachers, students, modules) loaded
     */
    public List<CourseEntityImpl> getAllWithAssociations() {
        return courseRepository.findAll();
    }

    /**
     * Find courses by title
     */
    public List<CourseEntityImpl> findByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }

    /**
     * Find courses where user is a teacher
     */
    public List<CourseEntityImpl> findCoursesByTeacher(Long userId) {
        return courseRepository.findCoursesByTeacherId(userId);
    }

    /**
     * Find courses where user is a student
     */
    public List<CourseEntityImpl> findCoursesByStudent(Long userId) {
        return courseRepository.findCoursesByStudentId(userId);
    }

    /**
     * Find all courses where user has access (as teacher or student)
     */
    public List<CourseEntityImpl> findCoursesByUser(Long userId) {
        return courseRepository.findCoursesByUserId(userId);
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String newTitle) {
        this.title = newTitle;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String newBody) {
        this.body = newBody;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public Course create(Long ignored, String title, String body) {
        // ID is ignored since database will auto-generate
        CourseEntityImpl course = new CourseEntityImpl(title, body);
        return courseRepository.save(course);
    }

    @Override
    public boolean removeSub(Long courseId) {
        if (courseRepository.existsById(courseId)) {
            courseRepository.deleteById(courseId);
            return true;
        }
        return false;
    }

    /**
     * Get a course by ID
     */
    public Optional<CourseEntityImpl> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }

    /**
     * Check if course exists
     */
    public boolean courseExists(Long courseId) {
        return courseRepository.existsById(courseId);
    }
}