package rebootedmvp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import rebootedmvp.domain.impl.ModuleEntityImpl;

import java.util.List;

/**
 * Repository interface for Module entities.
 * Provides database access methods for Module operations.
 */
@Repository
public interface ModuleRepository extends JpaRepository<ModuleEntityImpl, Long> {

    /**
     * Find modules by course ID
     */
    List<ModuleEntityImpl> findByCourse_Id(Long courseId);

    /**
     * Find modules by course ID ordered by creation date
     */
    List<ModuleEntityImpl> findByCourse_IdOrderByCreatedAtAsc(Long courseId);

    /**
     * Find modules by title (case-insensitive)
     */
    List<ModuleEntityImpl> findByTitleContainingIgnoreCase(String title);

    /**
     * Find modules by course ID and title (case-insensitive)
     */
    List<ModuleEntityImpl> findByCourse_IdAndTitleContainingIgnoreCase(Long courseId, String title);

    /**
     * Count modules in a specific course
     */
    @Query("SELECT COUNT(m) FROM ModuleEntityImpl m WHERE m.course.id = :courseId")
    Long countModulesInCourse(@Param("courseId") Long courseId);

    /**
     * Get total weight of all modules in a course
     */
    @Query("SELECT SUM(m.weight) FROM ModuleEntityImpl m WHERE m.course.id = :courseId")
    Double getTotalWeightInCourse(@Param("courseId") Long courseId);

    /**
     * Find modules with weight greater than specified value
     */
    @Query("SELECT m FROM ModuleEntityImpl m WHERE m.weight > :minWeight")
    List<ModuleEntityImpl> findModulesWithWeightGreaterThan(@Param("minWeight") Double minWeight);

    /**
     * Check if a module belongs to a specific course
     */
    @Query("SELECT COUNT(m) > 0 FROM ModuleEntityImpl m WHERE m.id = :moduleId AND m.course.id = :courseId")
    boolean existsByIdAndCourseId(@Param("moduleId") Long moduleId, @Param("courseId") Long courseId);
}