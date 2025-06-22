package rebootedmvp.domain.impl;

import rebootedmvp.Course;
import rebootedmvp.LDUser;
import rebootedmvp.Module;
import rebootedmvp.User;
import rebootedmvp.UnknownUserException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CourseImpl implements Course {
    private Long id;
    private String name;
    private String description;
    private Set<LDUser> teachers;
    private Set<LDUser> students;
    private List<Module> modules;

    public CourseImpl() {
        this.teachers = new HashSet<>();
        this.students = new HashSet<>();
        this.modules = new ArrayList<>();
    }

    public CourseImpl(Long id, String name, String description) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
    }

    @Override
    public Set<LDUser> get_teachers() {
        return new HashSet<>(teachers);
    }

    @Override
    public Set<LDUser> get_students() {
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
        return 0.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTeachers(Set<LDUser> teachers) {
        this.teachers = new HashSet<>(teachers);
    }

    public void setStudents(Set<LDUser> students) {
        this.students = new HashSet<>(students);
    }

    public void setModules(List<Module> modules) {
        this.modules = new ArrayList<>(modules);
    }
}