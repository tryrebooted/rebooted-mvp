package rebootedmvp.service;

import org.springframework.stereotype.Service;
import rebootedmvp.domain.impl.ModuleImpl;
import rebootedmvp.dto.ModuleDTO;
import rebootedmvp.dto.NewModuleDTO;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ModuleService {
    private final Map<Long, ModuleImpl> modules = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public List<ModuleDTO> findAll() {
        return modules.values().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public ModuleDTO findById(Long id) {
        ModuleImpl module = modules.get(id);
        if (module == null) {
            return null;
        }
        return convertToDTO(module);
    }

    public List<ModuleDTO> findByCourseId(Long courseId) {
        return modules.values().stream()
                .filter(module -> courseId.equals(module.getCourseId()))
                .map(this::convertToDTO)
                .toList();
    }

    public ModuleDTO create(NewModuleDTO newModuleDTO) {
        if (newModuleDTO.getName() == null || newModuleDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Module name cannot be empty");
        }
        if (newModuleDTO.getCourseId() == null) {
            throw new IllegalArgumentException("Course ID is required");
        }

        Long id = idGenerator.getAndIncrement();
        ModuleImpl module = new ModuleImpl(id, newModuleDTO.getName().trim(), 
                                         newModuleDTO.getDescription(), newModuleDTO.getCourseId());
        modules.put(id, module);
        
        return convertToDTO(module);
    }

    public ModuleDTO update(Long id, NewModuleDTO updateModuleDTO) {
        ModuleImpl module = modules.get(id);
        if (module == null) {
            return null;
        }

        if (updateModuleDTO.getName() != null && !updateModuleDTO.getName().trim().isEmpty()) {
            module.setName(updateModuleDTO.getName().trim());
        }
        if (updateModuleDTO.getDescription() != null) {
            module.setDescription(updateModuleDTO.getDescription());
        }
        if (updateModuleDTO.getCourseId() != null) {
            module.setCourseId(updateModuleDTO.getCourseId());
        }

        return convertToDTO(module);
    }

    public boolean delete(Long id) {
        return modules.remove(id) != null;
    }

    private ModuleDTO convertToDTO(ModuleImpl module) {
        return new ModuleDTO(
                module.getId(),
                module.getName(),
                module.getDescription(),
                module.checkProgress(),
                module.getCourseId(),
                module.getContent().size()
        );
    }
}