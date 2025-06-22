package rebootedmvp.service;

import org.springframework.stereotype.Service;
import rebootedmvp.Content;
import rebootedmvp.domain.impl.QuestionContentImpl;
import rebootedmvp.domain.impl.TextContentImpl;
import rebootedmvp.dto.ContentDTO;
import rebootedmvp.dto.NewContentDTO;
import rebootedmvp.dto.QuestionContentDTO;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ContentService {
    private final Map<Long, Content> contents = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public List<ContentDTO> findAll() {
        return contents.values().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<ContentDTO> findByModuleId(Long moduleId) {
        return contents.values().stream()
                .filter(content -> {
                    if (content instanceof TextContentImpl) {
                        return ((TextContentImpl) content).getModuleId().equals(moduleId);
                    } else if (content instanceof QuestionContentImpl) {
                        return ((QuestionContentImpl) content).getModuleId().equals(moduleId);
                    }
                    return false;
                })
                .map(this::convertToDTO)
                .toList();
    }

    public ContentDTO findById(Long id) {
        Content content = contents.get(id);
        if (content == null) {
            return null;
        }
        return convertToDTO(content);
    }

    public ContentDTO create(NewContentDTO newContentDTO) {
        if (newContentDTO.getTitle() == null || newContentDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Content title cannot be empty");
        }
        if (newContentDTO.getType() == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }

        Long id = idGenerator.getAndIncrement();
        Content content;

        if ("Text".equals(newContentDTO.getType())) {
            content = new TextContentImpl(id, newContentDTO.getTitle().trim(), 
                                        newContentDTO.getBody(), newContentDTO.getModuleId());
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
            
            content = new QuestionContentImpl(id, newContentDTO.getTitle().trim(), 
                                            newContentDTO.getBody(), options, correctAnswer, newContentDTO.getModuleId());
        } else {
            throw new IllegalArgumentException("Unsupported content type: " + newContentDTO.getType());
        }

        contents.put(id, content);
        return convertToDTO(content);
    }

    public ContentDTO update(Long id, NewContentDTO updateContentDTO) {
        Content content = contents.get(id);
        if (content == null) {
            return null;
        }

        if (content instanceof TextContentImpl) {
            TextContentImpl textContent = (TextContentImpl) content;
            if (updateContentDTO.getTitle() != null && !updateContentDTO.getTitle().trim().isEmpty()) {
                textContent.setTitle(updateContentDTO.getTitle().trim());
            }
            if (updateContentDTO.getBody() != null) {
                textContent.setBody(updateContentDTO.getBody());
            }
        } else if (content instanceof QuestionContentImpl) {
            QuestionContentImpl questionContent = (QuestionContentImpl) content;
            if (updateContentDTO.getTitle() != null && !updateContentDTO.getTitle().trim().isEmpty()) {
                questionContent.setTitle(updateContentDTO.getTitle().trim());
            }
            if (updateContentDTO.getBody() != null) {
                questionContent.setQuestionText(updateContentDTO.getBody());
            }
        }

        return convertToDTO(content);
    }

    public boolean delete(Long id) {
        return contents.remove(id) != null;
    }

    public ContentDTO markComplete(Long id) {
        Content content = contents.get(id);
        if (content == null) {
            return null;
        }

        if (content instanceof TextContentImpl) {
            ((TextContentImpl) content).setComplete(true);
        }

        return convertToDTO(content);
    }

    public ContentDTO submitAnswer(Long id, String answer) {
        Content content = contents.get(id);
        if (content == null) {
            return null;
        }

        if (content instanceof QuestionContentImpl) {
            ((QuestionContentImpl) content).setUserAnswer(answer);
        }

        return convertToDTO(content);
    }

    private ContentDTO convertToDTO(Content content) {
        if (content instanceof TextContentImpl) {
            TextContentImpl textContent = (TextContentImpl) content;
            return new ContentDTO(
                    textContent.getId(),
                    "Text",
                    textContent.getTitle(),
                    textContent.getBody(),
                    textContent.isComplete(),
                    textContent.getModuleId()
            );
        } else if (content instanceof QuestionContentImpl) {
            QuestionContentImpl questionContent = (QuestionContentImpl) content;
            return new QuestionContentDTO(
                    questionContent.getId(),
                    questionContent.getTitle(),
                    questionContent.getQuestionText(),
                    questionContent.isComplete(),
                    questionContent.getModuleId(),
                    questionContent.getOptions(),
                    questionContent.getCorrectAnswer(),
                    questionContent.getUserAnswer()
            );
        }
        return null;
    }
}