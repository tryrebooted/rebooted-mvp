package rebootedmvp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rebootedmvp.Content;
import rebootedmvp.dto.ContentDTO;
import rebootedmvp.service.ModuleService;

@RestController
@RequestMapping("/api/modules/{moduleId}")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<ContentDTO>> getAllContents(@PathVariable Long moduleId) {
        List<Content> contents = moduleService.findAll();
        return ResponseEntity.ok(mapToDTO(contents));
    }

    @GetMapping("/content/{contentId}")
    public ResponseEntity<ContentDTO> getContentById(@PathVariable Long moduleId, @PathVariable Long contentId) {
        Content con = moduleService.getById(moduleId, contentId);
        if (con == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new ContentDTO(con));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred: " + e.getMessage());
    }

    private static List<ContentDTO> mapToDTO(List<Content> toMap) {
        return toMap.stream().map(
                elem -> new ContentDTO(elem)).toList();
    }
}
