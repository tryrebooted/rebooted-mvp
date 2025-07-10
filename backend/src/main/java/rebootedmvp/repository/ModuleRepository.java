package rebootedmvp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import rebootedmvp.domain.impl.ModuleEntityImpl;

/**
 * Repository interface for Module entities.
 * Provides database access methods for Module operations.
 */
@Repository
public interface ModuleRepository extends JpaRepository<ModuleEntityImpl, Long> {

    /**
     * Find modules by course ID
     */
    List<ModuleEntityImpl> findByCourseId(Long courseId);

    /**
     * Find modules by course ID ordered by creation date
     */
    List<ModuleEntityImpl> findByCourseIdOrderByCreatedAtAsc(Long courseId);

    /**
     * Find modules by title (case-insensitive)
     */
    List<ModuleEntityImpl> findByTitleContainingIgnoreCase(String title);

    /**
     * Find modules by course ID and title (case-insensitive)
     */
    List<ModuleEntityImpl> findByCourseIdAndTitleContainingIgnoreCase(Long courseId, String title);

    /**
     * Count modules in a specific course
     */
    @Query("SELECT COUNT(m) FROM ModuleEntityImpl m WHERE m.courseId = :courseId")
    Long countModulesInCourse(@Param("courseId") Long courseId);

    /**
     * Get total weight of all modules in a course
     */
    @Query("SELECT SUM(m.weight) FROM ModuleEntityImpl m WHERE m.courseId = :courseId")
    Double getTotalWeightInCourse(@Param("courseId") Long courseId);

    /**
     * Find modules with weight greater than specified value
     */
    @Query("SELECT m FROM ModuleEntityImpl m WHERE m.weight > :minWeight")
    List<ModuleEntityImpl> findModulesWithWeightGreaterThan(@Param("minWeight") Double minWeight);

    /**
     * Check if a module belongs to a specific course
     */
    @Query("SELECT COUNT(m) > 0 FROM ModuleEntityImpl m WHERE m.id = :moduleId AND m.courseId = :courseId")
    boolean existsByIdAndCourseId(@Param("moduleId") Long moduleId, @Param("courseId") Long courseId);
}