package rebootedmvp.domain.impl;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import rebootedmvp.Content;

/**
 * JPA Entity implementation of Content interface for database persistence.
 * This replaces the in-memory TextContentImpl and QuestionContentImpl with proper database mapping.
 */
@Entity
@Table(name = "content")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "content_type", discriminatorType = DiscriminatorType.STRING)
public class ContentEntityImpl implements Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "is_complete")
    private boolean isComplete = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Many-to-One relationship back to Module
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private ModuleEntityImpl module;

    // Fields specific to Question content type
    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @ElementCollection
    @CollectionTable(name = "content_options", joinColumns = @JoinColumn(name = "content_id"))
    @Column(name = "option_text")
    private List<String> options = new ArrayList<>();

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "user_answer")
    private String userAnswer;

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
    public ContentEntityImpl() {}

    public ContentEntityImpl(String title, String body, ModuleEntityImpl module, ContentType contentType) {
        this.title = title;
        this.body = body;
        this.module = module;
        this.isComplete = false;
    }

    // Constructor for Question content
    public ContentEntityImpl(String title, String questionText, List<String> options, 
                           String correctAnswer, ModuleEntityImpl module) {
        this.title = title;
        this.questionText = questionText;
        this.options = new ArrayList<>(options);
        this.correctAnswer = correctAnswer;
        this.module = module;
        this.isComplete = false;
    }

    // Content interface methods
    @Override
    public boolean isComplete() {
        if (getType() == ContentType.Question) {
            return userAnswer != null && userAnswer.equals(correctAnswer);
        }
        return isComplete;
    }

    @Override
    public Content getContent() {
        return this;
    }

    @Override
    public ContentType getType() {
        // Default to Text - this will be overridden by discriminator in subclasses
        return ContentType.Text;
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

    // Additional getters and setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setComplete(boolean complete) {
        this.isComplete = complete;
    }

    public ModuleEntityImpl getModule() {
        return module;
    }

    public void setModule(ModuleEntityImpl module) {
        this.module = module;
    }

    public Long getModuleId() {
        return module != null ? module.getId() : null;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        return new ArrayList<>(options);
    }

    public void setOptions(List<String> options) {
        this.options = new ArrayList<>(options != null ? options : new ArrayList<>());
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
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

/**
 * Text Content Entity - represents text-based content
 */
@Entity
@DiscriminatorValue("TEXT")
class TextContentEntityImpl extends ContentEntityImpl {
    
    public TextContentEntityImpl() {
        super();
    }
    
    public TextContentEntityImpl(String title, String body, ModuleEntityImpl module) {
        super(title, body, module, ContentType.Text);
    }
    
    @Override
    public ContentType getType() {
        return ContentType.Text;
    }
}

/**
 * Question Content Entity - represents question-based content
 */
@Entity
@DiscriminatorValue("QUESTION")
class QuestionContentEntityImpl extends ContentEntityImpl {
    
    public QuestionContentEntityImpl() {
        super();
    }
    
    public QuestionContentEntityImpl(String title, String questionText, List<String> options, 
                                   String correctAnswer, ModuleEntityImpl module) {
        super(title, questionText, options, correctAnswer, module);
    }
    
    @Override
    public ContentType getType() {
        return ContentType.Question;
    }
    
    @Override
    public String getBody() {
        return getQuestionText();
    }
    
    @Override
    public void setBody(String body) {
        setQuestionText(body);
    }
}