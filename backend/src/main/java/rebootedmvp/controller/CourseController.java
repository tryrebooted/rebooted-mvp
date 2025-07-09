package rebootedmvp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rebootedmvp.Module;
import rebootedmvp.dto.ModuleDTO;
import rebootedmvp.dto.NewModuleDTO;
import rebootedmvp.service.CourseService;

@RestController
@RequestMapping("/api/courses/{courseId}")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.getById(courseId));
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable Long courseId, @PathVariable Long moduleId) {
        try {
            return ResponseEntity.ok(courseService.getById(courseId, moduleId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping("/add")
    public ResponseEntity<Long> createModule(@PathVariable Long courseId, @RequestBody NewModuleDTO newModuleDTO) {
        try {
            Long moduleId = courseService.addNew(courseId, newModuleDTO);
            return ResponseEntity.ok(moduleId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update/{id}")
    public void updateModule(@PathVariable Long courseId, @PathVariable Long id,
            @RequestBody NewModuleDTO updateModuleDTO) {
        courseService.update(courseId, id, updateModuleDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long courseId, @PathVariable Long id) {
        boolean deleted = courseService.delete(courseId, id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred: " + e.getMessage());
    }

}
