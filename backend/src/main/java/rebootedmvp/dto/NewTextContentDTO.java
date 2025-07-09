package rebootedmvp.dto;

import java.util.List;

import rebootedmvp.Content;

public class NewTextContentDTO extends NewContentDTO {

    public NewTextContentDTO() {
    }

    public NewTextContentDTO(String type, String title, String body, Long moduleId) {
        super(type, title, body, moduleId);
    }

}
