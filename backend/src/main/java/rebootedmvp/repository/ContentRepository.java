package rebootedmvp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import rebootedmvp.Content;
import rebootedmvp.domain.impl.ContentEntityImpl;

/**
 * Repository interface for Content entities.
 * Provides database access methods for Content operations.
 */
@Repository
public interface ContentRepository extends JpaRepository<ContentEntityImpl, Long> {

    /**
     * Find content by module ID
     */

    List<ContentEntityImpl> findByModuleId(Long moduleId);

    /**
     * Find content by module ID ordered by creation date
     */
    List<ContentEntityImpl> findByModuleIdOrderByCreatedAtAsc(Long moduleId);

    /**
     * Find content by title (case-insensitive)
     */
    List<ContentEntityImpl> findByTitleContainingIgnoreCase(String title);

    /**
     * Find content by module ID and title (case-insensitive)
     */
    List<ContentEntityImpl> findByModuleIdAndTitleContainingIgnoreCase(Long moduleId, String title);

    /**
     * Find content by type (TEXT or QUESTION)
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE TYPE(c) = :contentType")
    List<ContentEntityImpl> findByContentType(@Param("contentType") Class<? extends Content> contentType);

    /**
     * Find completed content for a specific module
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE c.moduleId = :moduleId AND c.isComplete = true")
    List<ContentEntityImpl> findCompletedContentByModuleId(@Param("moduleId") Long moduleId);

    /**
     * Find incomplete content for a specific module
     */
    @Query("SELECT c FROM ContentEntityImpl c WHERE c.moduleId = :moduleId AND c.isComplete = false")
    List<ContentEntityImpl> findIncompleteContentByModuleId(@Param("moduleId") Long moduleId);

    /**
     * Count content items in a specific module
     */
    @Query("SELECT COUNT(c) FROM ContentEntityImpl c WHERE c.moduleId = :moduleId")
    Long countContentInModule(@Param("moduleId") Long moduleId);

    /**
     * Count completed content items in a specific module
     */
    @Query("SELECT COUNT(c) FROM ContentEntityImpl c WHERE c.moduleId = :moduleId AND c.isComplete = true")
    Long countCompletedContentInModule(@Param("moduleId") Long moduleId);

    /**
     * Get completion percentage for a module
     */
    @Query("SELECT (COUNT(CASE WHEN c.isComplete = true THEN 1 END) * 100.0 / COUNT(c)) " +
            "FROM ContentEntityImpl c WHERE c.moduleId = :moduleId")
    Double getModuleCompletionPercentage(@Param("moduleId") Long moduleId);

    /**
     * Check if a content item belongs to a specific module
     */
    @Query("SELECT COUNT(c) > 0 FROM ContentEntityImpl c WHERE c.id = :contentId AND c.moduleId = :moduleId")
    boolean existsByIdAndModuleId(@Param("contentId") Long contentId, @Param("moduleId") Long moduleId);

    /**
     * Find question content with specific correct answer
     */
    // @Query("SELECT c FROM Content c WHERE c.correctAnswer = :correctAnswer")
    // List<Content> findByCorrectAnswer(@Param("correctAnswer") String
    // correctAnswer);
}