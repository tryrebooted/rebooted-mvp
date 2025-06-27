package rebootedmvp.domain.impl;

import rebootedmvp.Content;

public class TextContentImpl implements Content {

    private Long id;
    private String title;
    private String body;
    private boolean isComplete;
    private Long moduleId;

    public TextContentImpl(Long id, String title, String body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.isComplete = false;
    }

    public TextContentImpl(Long id, String title, String body, Long moduleId) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.moduleId = moduleId;
        this.isComplete = false;
    }

    @Override
    public boolean isComplete() {
        return isComplete;
    }

    @Override
    public Content getContent() {
        return this;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String body) {
        this.body = body;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    @Override
    public ContentType getType() {
        return ContentType.Text;
    }
}
