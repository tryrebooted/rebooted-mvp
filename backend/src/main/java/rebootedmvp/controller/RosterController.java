package rebootedmvp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
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

import rebootedmvp.Course;
import rebootedmvp.Roster;
import rebootedmvp.dto.CourseDTO;
import rebootedmvp.dto.NewCourseDTO;
import rebootedmvp.dto.NewRosterDTO;
import rebootedmvp.service.RosterService;

@RestController
@RequestMapping("/api/roster")
public class RosterController {

    @Autowired
    private RosterService rosterService;

    @PostMapping
    public ResponseEntity<Long> createRoster() {
        Long rosterId = rosterService.addToHigh(new NewRosterDTO("Main Roster", "Description"), Roster::new);
        return ResponseEntity.ok(rosterId);
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<Course> courses = rosterService.findAll();

        return ResponseEntity.ok(mapToDTO(courses));
    }

    @PostMapping("/add")
    public ResponseEntity<Long> createCourse(@RequestBody NewCourseDTO newCourseDTO) {
        try {
            Long courseId = rosterService.addNew(Long.valueOf(0), newCourseDTO);
            return ResponseEntity.ok(courseId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update/{id}")
    public void updateCourse(@PathVariable Long id, @RequestBody NewCourseDTO updateCourseDTO) {
        rosterService.update(Long.valueOf(0), id, updateCourseDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        boolean deleted = rosterService.delete(Long.valueOf(0), id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                .body("An error occurred: " + e.getMessage());
    }

    private static List<CourseDTO> mapToDTO(List<Course> toMap) {
        return toMap.stream().map(
                elem -> new CourseDTO(elem)).toList();
    }
}
