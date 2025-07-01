package rebootedmvp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import rebootedmvp.Content;
import rebootedmvp.domain.impl.ContentEntityImpl;
import rebootedmvp.domain.impl.ModuleEntityImpl;
import rebootedmvp.dto.ContentDTO;
import rebootedmvp.dto.NewContentDTO;
import rebootedmvp.dto.QuestionContentDTO;
import rebootedmvp.repository.ContentRepository;
import rebootedmvp.repository.ModuleRepository;

@Service
@Transactional
public class ContentService {

    private static final Logger logger = LoggerFactory.getLogger(ContentService.class);

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Transactional(readOnly = true)
    public List<ContentDTO> findAll() {
        logger.debug("ContentService.findAll() called");
        return contentRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContentDTO> findByModuleId(Long moduleId) {
        logger.debug("ContentService.findByModuleId({}) called", moduleId);
        return contentRepository.findByModule_IdOrderByCreatedAtAsc(moduleId).stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContentDTO findById(Long id) {
        logger.debug("ContentService.findById({}) called", id);
        Optional<ContentEntityImpl> content = contentRepository.findById(id);
        return content.map(this::convertToDTO).orElse(null);
    }

    public ContentDTO create(NewContentDTO newContentDTO) {
        logger.debug("ContentService.create() called with type: {}", newContentDTO.getType());
        
        if (newContentDTO.getTitle() == null || newContentDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Content title cannot be empty");
        }
        if (newContentDTO.getType() == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        if (newContentDTO.getModuleId() == null) {
            throw new IllegalArgumentException("Module ID cannot be null");
        }

        // Find the module
        Optional<ModuleEntityImpl> moduleOpt = moduleRepository.findById(newContentDTO.getModuleId());
        if (moduleOpt.isEmpty()) {
            throw new IllegalArgumentException("Module not found with ID: " + newContentDTO.getModuleId());
        }
        ModuleEntityImpl module = moduleOpt.get();

        ContentEntityImpl content;

        if ("Text".equals(newContentDTO.getType())) {
            content = new ContentEntityImpl(
                newContentDTO.getTitle().trim(),
                newContentDTO.getBody(),
                module,
                Content.ContentType.Text
            );
        } else if ("Question".equals(newContentDTO.getType())) {
            List<String> options = newContentDTO.getOptions() != null ? newContentDTO.getOptions() : List.of();
            String correctAnswer = newContentDTO.getCorrectAnswer() != null ? newContentDTO.getCorrectAnswer() : "";

            // Validate question data
            if (options.size() < 2) {
                throw new IllegalArgumentException("Question must have at least 2 options");
            }
            if (correctAnswer.isEmpty()) {
                throw new IllegalArgumentException("Question must have a correct answer");
            }
            if (!options.contains(correctAnswer)) {
                throw new IllegalArgumentException("Correct answer must be one of the provided options");
            }

            content = new ContentEntityImpl(
                newContentDTO.getTitle().trim(),
                newContentDTO.getBody(),
                options,
                correctAnswer,
                module
            );
        } else {
            throw new IllegalArgumentException("Unsupported content type: " + newContentDTO.getType());
        }

        ContentEntityImpl savedContent = contentRepository.save(content);
        logger.info("Created content with ID: {} in module: {}", savedContent.getId(), module.getId());
        return convertToDTO(savedContent);
    }

    public ContentDTO update(Long id, NewContentDTO updateContentDTO) {
        logger.debug("ContentService.update({}) called", id);
        
        Optional<ContentEntityImpl> contentOpt = contentRepository.findById(id);
        if (contentOpt.isEmpty()) {
            return null;
        }

        ContentEntityImpl content = contentOpt.get();

        if (updateContentDTO.getTitle() != null && !updateContentDTO.getTitle().trim().isEmpty()) {
            content.setTitle(updateContentDTO.getTitle().trim());
        }
        if (updateContentDTO.getBody() != null) {
            if (content.getType() == Content.ContentType.Text) {
                content.setBody(updateContentDTO.getBody());
            } else if (content.getType() == Content.ContentType.Question) {
                content.setQuestionText(updateContentDTO.getBody());
            }
        }

        // Update question-specific fields if this is a question
        if (content.getType() == Content.ContentType.Question) {
            if (updateContentDTO.getOptions() != null) {
                content.setOptions(updateContentDTO.getOptions());
            }
            if (updateContentDTO.getCorrectAnswer() != null) {
                content.setCorrectAnswer(updateContentDTO.getCorrectAnswer());
            }
        }

        ContentEntityImpl savedContent = contentRepository.save(content);
        logger.info("Updated content with ID: {}", savedContent.getId());
        return convertToDTO(savedContent);
    }

    public boolean delete(Long id) {
        logger.debug("ContentService.delete({}) called", id);
        
        if (contentRepository.existsById(id)) {
            contentRepository.deleteById(id);
            logger.info("Deleted content with ID: {}", id);
            return true;
        }
        return false;
    }

    public ContentDTO markComplete(Long id) {
        logger.debug("ContentService.markComplete({}) called", id);
        
        Optional<ContentEntityImpl> contentOpt = contentRepository.findById(id);
        if (contentOpt.isEmpty()) {
            return null;
        }

        ContentEntityImpl content = contentOpt.get();
        content.setComplete(true);
        
        ContentEntityImpl savedContent = contentRepository.save(content);
        logger.info("Marked content {} as complete", savedContent.getId());
        return convertToDTO(savedContent);
    }

    public ContentDTO submitAnswer(Long id, String answer) {
        logger.debug("ContentService.submitAnswer({}, {}) called", id, answer);
        
        Optional<ContentEntityImpl> contentOpt = contentRepository.findById(id);
        if (contentOpt.isEmpty()) {
            return null;
        }

        ContentEntityImpl content = contentOpt.get();
        if (content.getType() == Content.ContentType.Question) {
            content.setUserAnswer(answer);
            
            ContentEntityImpl savedContent = contentRepository.save(content);
            logger.info("Submitted answer for content {}: {}", savedContent.getId(), answer);
            return convertToDTO(savedContent);
        }

        return convertToDTO(content);
    }

    private ContentDTO convertToDTO(ContentEntityImpl content) {
        if (content.getType() == Content.ContentType.Text) {
            return new ContentDTO(
                content.getId(),
                Content.ContentType.Text,
                content.getTitle(),
                content.getBody(),
                content.isComplete(),
                content.getModuleId()
            );
        } else if (content.getType() == Content.ContentType.Question) {
            return new QuestionContentDTO(
                content.getId(),
                content.getTitle(),
                content.getQuestionText(),
                content.isComplete(),
                content.getModuleId(),
                content.getOptions(),
                content.getCorrectAnswer(),
                content.getUserAnswer()
            );
        }
        return null;
    }
}
