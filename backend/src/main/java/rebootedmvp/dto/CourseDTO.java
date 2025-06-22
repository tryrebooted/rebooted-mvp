package rebootedmvp.dto;

public class CourseDTO {
    private Long id;
    private String name;
    private String description;
    private int teacherCount;
    private int studentCount;
    private int moduleCount;

    public CourseDTO() {}

    public CourseDTO(Long id, String name, String description, int teacherCount, int studentCount, int moduleCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teacherCount = teacherCount;
        this.studentCount = studentCount;
        this.moduleCount = moduleCount;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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