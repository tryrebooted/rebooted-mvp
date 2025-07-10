package rebootedmvp.dto;

import rebootedmvp.Course;

public class CourseDTO {

    private Long id;
    private String title;
    private String body;
    private int teacherCount;
    private int studentCount;
    private int moduleCount;

    public CourseDTO(Course c) {
        id = c.getId();
        title = c.getTitle();
        body = c.getBody();
        teacherCount = c.getTeachers().size();
        studentCount = c.getStudents().size();
        moduleCount = c.getAll().size();
    }

    public CourseDTO(Long id, String title, String body, int moduleCount) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.teacherCount = 0;
        this.studentCount = 0;
        this.moduleCount = moduleCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public int getTeacherCount() {
        return teacherCount;
    }

    public void setTeacherCount(int teacherCount) {
        this.teacherCount = teacherCount;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public int getModuleCount() {
        return moduleCount;
    }

    public void setModuleCount(int moduleCount) {
        this.moduleCount = moduleCount;
    }
}
