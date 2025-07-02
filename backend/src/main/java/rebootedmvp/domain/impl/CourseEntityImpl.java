package rebootedmvp.domain.impl;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import rebootedmvp.Course;
import rebootedmvp.Module;
import rebootedmvp.UnknownUserException;
import rebootedmvp.User;
import rebootedmvp.domain.impl.UserImpl;

/**
 * JPA Entity implementation of Course interface for database persistence.
 * This replaces the in-memory CourseImpl with proper database mapping.
 */
@Entity
@Table(name = "courses")
public class CourseEntityImpl implements Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // One-to-Many relationship with ModuleEntityImpl
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ModuleEntityImpl> modules = new ArrayList<>();

    // Many-to-Many relationship for teachers
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "course_teachers",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserProfileImpl> teachers = new HashSet<>();

    // Many-to-Many relationship for students
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "course_students",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserProfileImpl> students = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public CourseEntityImpl() {}

    public CourseEntityImpl(String title, String body) {
        this.title = title;
        this.body = body;
    }

    // Course interface methods
    @Override
    public Module create(Long ignored, String title, String body) {
        return new ModuleEntityImpl(title, body, this);
    }

    @Override
    public Set<User> get_teachers() {
        // Convert UserProfileImpl to User interface
        Set<User> userSet = new HashSet<>();
        for (UserProfileImpl userProfile : teachers) {
            userSet.add(convertToUser(userProfile));
        }
        return userSet;
    }

    @Override
    public Set<User> get_students() {
        // Convert UserProfileImpl to User interface
        Set<User> userSet = new HashSet<>();
        for (UserProfileImpl userProfile : students) {
            userSet.add(convertToUser(userProfile));
        }
        return userSet;
    }

    public List<Module> get_modules() {
        return new ArrayList<>(modules);
    }

    @Override
    public double getProgress(User user) throws UnknownUserException {
        // TODO: Implement actual progress calculation based on module completion
        return 0.0;
    }

    @Override
    public ArrayList<ArrayList<Boolean>> getCompletion(User user) throws UnknownUserException {
        // TODO: Implement completion tracking
        throw new UnsupportedOperationException("Completion tracking not yet implemented");
    }

    @Override
    public boolean addStudent(User user) {
        UserProfileImpl userProfile = (UserProfileImpl) user;
        if (userProfile.getUserType().equals("EmployeeUser")) {
            return students.add(userProfile);
        }
        return false;
    }

    @Override
    public boolean removeStudent(User user) {
        UserProfileImpl userProfile = (UserProfileImpl) user;
        return students.remove(userProfile);
    }

    @Override
    public boolean isStudent(User user) {
        UserProfileImpl userProfile = (UserProfileImpl) user;
        return students.contains(userProfile);
    }

    @Override
    public boolean addTeacher(User user) {
        UserProfileImpl userProfile = (UserProfileImpl) user;
        if (userProfile.getUserType().equals("LDUser")) {
            return teachers.add(userProfile);
        }
        return false;
    }

    @Override
    public boolean removeTeacher(User user) {
        UserProfileImpl userProfile = (UserProfileImpl) user;
        return teachers.remove(userProfile);
    }

    @Override
    public boolean isTeacher(User user) {
        UserProfileImpl userProfile = (UserProfileImpl) user;
        return teachers.contains(userProfile);
    }

    // InfoContainer interface methods
    @Override
    public void addSub(Long id, Module newMod) {
        ModuleEntityImpl moduleEntity = (ModuleEntityImpl) newMod;
        moduleEntity.setCourse(this);
        modules.add(moduleEntity);
    }

    @Override
    public List<Module> getAll() {
        return get_modules();
    }

    @Override
    public boolean removeSub(Long moduleId) {
        return modules.removeIf(module -> module.getId().equals(moduleId));
    }

    // HasID interface methods
    @Override
    public Long getId() {
        return id;
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

    // Additional getters and setters for JPA
    public void setId(Long id) {
        this.id = id;
    }

    public List<ModuleEntityImpl> getModuleEntities() {
        return modules;
    }

    public void setModuleEntities(List<ModuleEntityImpl> modules) {
        this.modules = modules;
    }

    public Set<UserProfileImpl> getTeacherProfiles() {
        return teachers;
    }

    public void setTeacherProfiles(Set<UserProfileImpl> teachers) {
        this.teachers = teachers;
    }

    public Set<UserProfileImpl> getStudentProfiles() {
        return students;
    }

    public void setStudentProfiles(Set<UserProfileImpl> students) {
        this.students = students;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    private User convertToUser(UserProfileImpl userProfile) {
        // Convert UserProfileImpl to UserImpl
        User.UserType userType = User.UserType.valueOf(userProfile.getUserType());
        UserImpl user = new UserImpl(userProfile.getUsername(), userType);
        return user;
    }
}