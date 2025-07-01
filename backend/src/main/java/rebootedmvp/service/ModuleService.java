package rebootedmvp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import rebootedmvp.Content;
import rebootedmvp.domain.impl.ContentEntityImpl;
import rebootedmvp.domain.impl.ModuleEntityImpl;
import rebootedmvp.dto.NewContentDTO;
import rebootedmvp.repository.ContentRepository;
import rebootedmvp.repository.ModuleRepository;

@Service
@Transactional
public class ModuleService {

    private static final Logger logger = LoggerFactory.getLogger(ModuleService.class);

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private ContentRepository contentRepository;

    /**
     * Returns a list of all content in all modules
     */
    @Transactional(readOnly = true)
    public List<Content> findAll() {
        logger.debug("ModuleService.findAll() called - returning all content");
        return contentRepository.findAll().stream()
                .map(this::convertToContent)
                .toList();
    }

    /**
     * Returns a list of all content within the module with given ID
     */
    @Transactional(readOnly = true)
    public List<Content> getById(Long moduleId) {
        logger.debug("ModuleService.getById({}) called - getting content for module", moduleId);
        
        if (!moduleRepository.existsById(moduleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }
        
        return contentRepository.findByModule_IdOrderByCreatedAtAsc(moduleId).stream()
                .map(this::convertToContent)
                .toList();
    }

    /**
     * Returns the specific content within the module
     */
    @Transactional(readOnly = true)
    public Content getById(Long moduleId, Long contentId) {
        logger.debug("ModuleService.getById({}, {}) called - getting specific content", moduleId, contentId);
        
        if (!moduleRepository.existsById(moduleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }
        
        Optional<ContentEntityImpl> contentOpt = contentRepository.findById(contentId);
        if (contentOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found with id: " + contentId);
        }
        
        ContentEntityImpl content = contentOpt.get();
        if (!content.getModuleId().equals(moduleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content " + contentId + " does not belong to module " + moduleId);
        }
        
        return convertToContent(content);
    }

    /**
     * Adds new content to the specified module
     */
    public Long addNew(Long moduleId, NewContentDTO newContentDTO) {
        logger.debug("ModuleService.addNew({}, {}) called", moduleId, newContentDTO.getTitle());
        
        if (newContentDTO.getTitle() == null || newContentDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title must be supplied in the DTO");
        }

        Optional<ModuleEntityImpl> moduleOpt = moduleRepository.findById(moduleId);
        if (moduleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }
        
        ModuleEntityImpl module = moduleOpt.get();
        
        // Set the module ID in the DTO for the content service
        newContentDTO.setModuleId(moduleId);
        
        ContentEntityImpl content;
        if ("Text".equals(newContentDTO.getType())) {
            content = new ContentEntityImpl(
                newContentDTO.getTitle().trim(),
                newContentDTO.getBody(),
                module,
                Content.ContentType.Text
            );
        } else if ("Question".equals(newContentDTO.getType())) {
            content = new ContentEntityImpl(
                newContentDTO.getTitle().trim(),
                newContentDTO.getBody(),
                newContentDTO.getOptions(),
                newContentDTO.getCorrectAnswer(),
                module
            );
        } else {
            throw new IllegalArgumentException("Unsupported content type: " + newContentDTO.getType());
        }
        
        ContentEntityImpl savedContent = contentRepository.save(content);
        logger.info("Created content with ID: {} in module: {}", savedContent.getId(), moduleId);
        return savedContent.getId();
    }

    /**
     * Updates content within a module
     */
    public void update(Long moduleId, Long contentId, NewContentDTO updateDTO) {
        logger.debug("ModuleService.update({}, {}, {}) called", moduleId, contentId, updateDTO.getTitle());
        
        if (!moduleRepository.existsById(moduleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found with id: " + moduleId);
        }
        
        Optional<ContentEntityImpl> contentOpt = contentRepository.findById(contentId);
        if (contentOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found with id: " + contentId);
        }
        
        ContentEntityImpl content = contentOpt.get();
        if (!content.getModuleId().equals(moduleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content " + contentId + " does not belong to module " + moduleId);
        }

        if (updateDTO.getTitle() != null && !updateDTO.getTitle().trim().isEmpty()) {
            content.setTitle(updateDTO.getTitle().trim());
        }
        if (updateDTO.getBody() != null) {
            if (content.getType() == Content.ContentType.Text) {
                content.setBody(updateDTO.getBody());
            } else if (content.getType() == Content.ContentType.Question) {
                content.setQuestionText(updateDTO.getBody());
            }
        }

        // Update question-specific fields if this is a question
        if (content.getType() == Content.ContentType.Question) {
            if (updateDTO.getOptions() != null) {
                content.setOptions(updateDTO.getOptions());
            }
            if (updateDTO.getCorrectAnswer() != null) {
                content.setCorrectAnswer(updateDTO.getCorrectAnswer());
            }
        }
        
        contentRepository.save(content);
        logger.info("Updated content with ID: {} in module: {}", contentId, moduleId);
    }

    /**
     * Deletes content from a module
     */
    public boolean delete(Long moduleId, Long contentId) {
        logger.debug("ModuleService.delete({}, {}) called", moduleId, contentId);
        
        if (!moduleRepository.existsById(moduleId)) {
            return false;
        }
        
        Optional<ContentEntityImpl> contentOpt = contentRepository.findById(contentId);
        if (contentOpt.isEmpty()) {
            return false;
        }
        
        ContentEntityImpl content = contentOpt.get();
        if (!content.getModuleId().equals(moduleId)) {
            return false;
        }
        
        contentRepository.deleteById(contentId);
        logger.info("Deleted content with ID: {} from module: {}", contentId, moduleId);
        return true;
    }

    private Content convertToContent(ContentEntityImpl contentEntity) {
        // Convert ContentEntityImpl to Content interface
        // Note: This assumes ContentEntityImpl already implements Content interface
        return contentEntity;
    }
}
