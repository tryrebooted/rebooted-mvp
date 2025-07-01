package rebootedmvp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import rebootedmvp.Content;
import rebootedmvp.domain.impl.ContentEntityImpl;

import java.util.List;

/**
 * Repository interface for Content entities.
 * Provides database access methods for Content operations.
 */
@Repository
public interface ContentRepository extends JpaRepository<ContentEntityImpl, Long> {

    /**
     * Find content by module ID
     */
    List<ContentEntityImpl> findByModule_Id(Long moduleId);

    /**
     * Find content by module ID ordered by creation date
     */
    List<ContentEntityImpl> findByModule_IdOrderByCreatedAtAsc(Long moduleId);

    /**
     * Find content by title (case-insensitive)
     */
    List<ContentEntityImpl> findByTitleContainingIgnoreCase(String title);

    /**
     * Find content by module ID and title (case-insensitive)
     */
    List<ContentEntityImpl> findByModule_IdAndTitleContainingIgnoreCase(Long moduleId, String title);

    /**
     * Find content by type (TEXT or QUESTION)
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE TYPE(c) = :contentType")
    List<ContentEntityImpl> findByContentType(@Param("contentType") Class<? extends ContentEntityImpl> contentType);

    /**
     * Find completed content for a specific module
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE c.module.id = :moduleId AND c.isComplete = true")
    List<ContentEntityImpl> findCompletedContentByModuleId(@Param("moduleId") Long moduleId);

    /**
     * Find incomplete content for a specific module
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE c.module.id = :moduleId AND c.isComplete = false")
    List<ContentEntityImpl> findIncompleteContentByModuleId(@Param("moduleId") Long moduleId);

    /**
     * Count content items in a specific module
     */
    @Query("SELECT COUNT(c) FROM ContentEntityImpl c WHERE c.module.id = :moduleId")
    Long countContentInModule(@Param("moduleId") Long moduleId);

    /**
     * Count completed content items in a specific module
     */
    @Query("SELECT COUNT(c) FROM ContentEntityImpl c WHERE c.module.id = :moduleId AND c.isComplete = true")
    Long countCompletedContentInModule(@Param("moduleId") Long moduleId);

    /**
     * Get completion percentage for a module
     */
    @Query("SELECT (COUNT(CASE WHEN c.isComplete = true THEN 1 END) * 100.0 / COUNT(c)) " +
           "FROM ContentEntityImpl c WHERE c.module.id = :moduleId")
    Double getModuleCompletionPercentage(@Param("moduleId") Long moduleId);

    /**
     * Check if a content item belongs to a specific module
     */
    @Query("SELECT COUNT(c) > 0 FROM ContentEntityImpl c WHERE c.id = :contentId AND c.module.id = :moduleId")
    boolean existsByIdAndModuleId(@Param("contentId") Long contentId, @Param("moduleId") Long moduleId);

    /**
     * Find question content with specific correct answer
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE c.correctAnswer = :correctAnswer")
    List<ContentEntityImpl> findByCorrectAnswer(@Param("correctAnswer") String correctAnswer);
}