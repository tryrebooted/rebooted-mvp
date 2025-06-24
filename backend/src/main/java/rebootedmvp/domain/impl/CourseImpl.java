package rebootedmvp.domain.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import rebootedmvp.Course;
import rebootedmvp.Module;
import rebootedmvp.UnknownUserException;
import rebootedmvp.User;

public class CourseImpl implements Course {

    private Long id;
    private String name;
    private String description;
    private Set<User> teachers;
    private Set<User> students;
    private List<Module> modules;
    private double progress;

    public CourseImpl() {
        this.teachers = new HashSet<>();
        this.students = new HashSet<>();
        this.modules = new ArrayList<>();
    }

    public CourseImpl(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teachers = new HashSet<>();
        this.students = new HashSet<>();
        this.modules = new ArrayList<>();
        this.progress = 0;
    }

    @Override
    public Set<User> get_teachers() {
        return new HashSet<>(teachers);
    }

    @Override
    public Set<User> get_students() {
        return new HashSet<>(students);
    }

    @Override
    public List<Module> get_modules() {
        return new ArrayList<>(modules);
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public double getProgress(User user) throws UnknownUserException {
        return progress;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTeachers(Set<User> teachers) {
        this.teachers = new HashSet<>(teachers);
    }

    public void setStudents(Set<User> students) {
        this.students = new HashSet<>(students);
    }

    public void setModules(List<Module> modules) {
        this.modules = new ArrayList<>(modules);
    }

    @Override
    public boolean addStudent(User user) {
        if (user.getUserType() == User.UserType.EmployeeUser) {
            this.students.add(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean removeStudent(User user) throws UnknownUserException {
        if (students.contains(user)) {
            students.remove(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean isStudent(User user) {
        return students.contains(user);
    }

    @Override
    public boolean addTeacher(User user) {
        if (user.getUserType() == User.UserType.LDUser) {
            this.teachers.add(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean removeTeacher(User user) throws UnknownUserException {
        if (teachers.contains(user)) {
            teachers.remove(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean isTeacher(User user) {
        return teachers.contains(user);
    }

    @Override
    public ArrayList<ArrayList<Boolean>> getCompletion(User user) throws UnknownUserException {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
