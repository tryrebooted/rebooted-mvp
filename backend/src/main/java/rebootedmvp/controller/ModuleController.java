package rebootedmvp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rebootedmvp.dto.ModuleDTO;
import rebootedmvp.dto.NewModuleDTO;
import rebootedmvp.service.ModuleService;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    
    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        List<ModuleDTO> modules = moduleService.findAll();
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable Long id) {
        ModuleDTO module = moduleService.findById(id);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(module);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ModuleDTO>> getModulesByCourseId(@PathVariable Long courseId) {
        List<ModuleDTO> modules = moduleService.findByCourseId(courseId);
        return ResponseEntity.ok(modules);
    }

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(@RequestBody NewModuleDTO newModuleDTO) {
        try {
            ModuleDTO createdModule = moduleService.create(newModuleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdModule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(@PathVariable Long id, @RequestBody NewModuleDTO updateModuleDTO) {
        try {
            ModuleDTO updatedModule = moduleService.update(id, updateModuleDTO);
            if (updatedModule == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedModule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        boolean deleted = moduleService.delete(id);
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