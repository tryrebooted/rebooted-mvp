package rebootedmvp.dto;

public class NewRosterDTO implements NewDTO {

    private String title;
    private String body;

    // public NewCourseDTO() {}
    public NewRosterDTO(String title, String body) {
        this.title = title;
        this.body = body;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String name) {
        this.title = name;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String body) {
        this.body = body;
    }

}
