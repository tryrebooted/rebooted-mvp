package rebootedmvp.domain.impl;

import java.util.ArrayList;
import java.util.List;

import rebootedmvp.Content;
import rebootedmvp.Module;
import rebootedmvp.UnknownUserException;

public class ModuleImpl implements Module {

    private Long id;
    private String name;
    private String description;
    private Long courseId;
    private List<Content> content;
    private double weight;

    public ModuleImpl() {
        this.content = new ArrayList<>();
    }

    public ModuleImpl(Long id, String name, String description, Long courseId) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
        this.courseId = courseId;
        this.weight = 1.;
    }

    public ModuleImpl(Long id, String name, String description, Long courseId, double weight) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
        this.courseId = courseId;
        this.weight = weight;
    }

    @Override
    public List<Content> getContent() {
        return new ArrayList<>(content);
    }

    public void addContent(Content contentItem) {
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    @Override
    public double getWeight() throws UnknownUserException {
        return weight;
    }
}
