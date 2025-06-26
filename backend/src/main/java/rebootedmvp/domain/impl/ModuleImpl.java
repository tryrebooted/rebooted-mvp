package rebootedmvp.domain.impl;

import java.util.ArrayList;
import java.util.List;

import rebootedmvp.Content;
import rebootedmvp.Module;

public class ModuleImpl implements Module {

    private Long id;
    private String title;
    private String body;
    private Long courseId;
    private List<Content> content;
    private double weight;

    // public ModuleImpl() {
    //     this.content = new ArrayList<>();
    // }
    public ModuleImpl(Long id, String title, String body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.weight = 1.;
    }

    public ModuleImpl(Long id, String title, String body, Long courseId) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.courseId = courseId;
        this.weight = 1.;
    }

    public ModuleImpl(Long id, String title, String body, Long courseId, double weight) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.courseId = courseId;
        this.weight = weight;
    }

    @Override
    public ModuleImpl create(Long id, String title, String body) {
        return new ModuleImpl(id, title, body);
    }

    @Override
    public List<Content> getContent() {
        return new ArrayList<>(content);
    }

    @Override
    public void addSub(Content contentItem) {
        if (contentItem != null) {
            this.content.add(contentItem);
        }
    }

    public void removeContent(Content contentItem) {
        this.content.remove(contentItem);
    }

    public void setContent(List<Content> content) {
        this.content = new ArrayList<>(content != null ? content : new ArrayList<>());
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    @Override
    public double getWeight() {
        return weight;
    }

    @Override
    public List<Content> getAll() {
        return new ArrayList<>(content);
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

}
