package rebootedmvp.domain.impl;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import rebootedmvp.Content;
import rebootedmvp.Module;

/**
 * JPA Entity implementation of Module interface for database persistence.
 * This replaces the in-memory ModuleImpl with proper database mapping.
 */
@Entity
@Table(name = "modules")
public class ModuleEntityImpl implements Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private double weight = 1.0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Many-to-One relationship back to Course
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private CourseEntityImpl course;

    // One-to-Many relationship with ContentEntityImpl
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ContentEntityImpl> contentItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public ModuleEntityImpl() {}

    public ModuleEntityImpl(String title, String body) {
        this.title = title;
        this.body = body;
        this.weight = 1.0;
    }

    public ModuleEntityImpl(String title, String body, CourseEntityImpl course) {
        this.title = title;
        this.body = body;
        this.course = course;
        this.weight = 1.0;
    }

    public ModuleEntityImpl(String title, String body, CourseEntityImpl course, double weight) {
        this.title = title;
        this.body = body;
        this.course = course;
        this.weight = weight;
    }

    // Module interface methods
    @Override
    public Content create(Long id, String title, String body) {
        return new ContentEntityImpl(title, body, this, Content.ContentType.Text);
    }

    @Override
    public double getWeight() {
        return weight;
    }

    @Override
    public List<Content> getContent() {
        return new ArrayList<>(contentItems);
    }

    @Override
    public Long getCourseId() {
        return course != null ? course.getId() : null;
    }

    // InfoContainer interface methods
    @Override
    public void addSub(Long id, Content contentItem) {
        if (contentItem instanceof ContentEntityImpl) {
            ContentEntityImpl contentEntity = (ContentEntityImpl) contentItem;
            contentEntity.setModule(this);
            contentItems.add(contentEntity);
        }
    }

    @Override
    public List<Content> getAll() {
        return getContent();
    }

    @Override
    public boolean removeSub(Long contentId) {
        return contentItems.removeIf(content -> content.getId().equals(contentId));
    }

    // HasID interface methods
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String newTitle) {
        this.title = newTitle;
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public void setBody(String newBody) {
        this.body = newBody;
    }

    // Additional getters and setters for JPA
    public void setId(Long id) {
        this.id = id;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public CourseEntityImpl getCourse() {
        return course;
    }

    public void setCourse(CourseEntityImpl course) {
        this.course = course;
    }

    public List<ContentEntityImpl> getContentEntities() {
        return contentItems;
    }

    public void setContentEntities(List<ContentEntityImpl> contentItems) {
        this.contentItems = contentItems;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}