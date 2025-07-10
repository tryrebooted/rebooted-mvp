package rebootedmvp;

import org.springframework.stereotype.Component;

import rebootedmvp.domain.impl.ModuleEntityImpl;

@Component
public class ModuleMapper {
    public static Module toDomain(ModuleEntityImpl entity) {
        return entity;
    }

    public static ModuleEntityImpl toEntity(Module domain) {
        return new ModuleEntityImpl(domain);
    }
}