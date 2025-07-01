package rebootedmvp.domain.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import rebootedmvp.Course;
import rebootedmvp.Module;
import rebootedmvp.UnknownUserException;
import rebootedmvp.User;

public class CourseImpl implements Course {

    private Long id;
    private String title;
    private String body;
    private Set<User> teachers;
    private Set<User> students;
    private final Map<Long, Module> modules;
    private double progress;

    public CourseImpl() {
        this.teachers = new HashSet<>();
        this.students = new HashSet<>();
        this.modules = new HashMap<>();
    }

    public CourseImpl(Long id, String title, String body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.teachers = new HashSet<>();
        this.students = new HashSet<>();
        this.modules = new HashMap<>();
        this.progress = 0;
    }

    @Override
    public Module create(Long id, String title, String body) {
        return new ModuleImpl(id, title, body);
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
    public double getProgress(User user) throws UnknownUserException {
        return progress;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTeachers(Set<User> teachers) {
        this.teachers = new HashSet<>(teachers);
    }

    public void setStudents(Set<User> students) {
        this.students = new HashSet<>(students);
    }

    @Override
    public void addSub(Long id, Module newMod) {
        modules.put(id, newMod);
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

    @Override
    public List<Module> getAll() {
        return new ArrayList<>(modules.values());
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String newTitle) {
        title = newTitle;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String newBody) {
        body = newBody;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public boolean removeSub(Long moduleId) {
        Module elem = modules.remove(moduleId);
        return elem != null;
    }
}
