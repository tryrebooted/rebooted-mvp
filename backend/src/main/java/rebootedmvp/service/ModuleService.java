package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.Content;
import rebootedmvp.Module;
import rebootedmvp.domain.impl.ModuleImpl;
import rebootedmvp.dto.NewContentDTO;

@Service
public class ModuleService extends ServiceType<Module, Content, NewContentDTO> {

    @Override
    public Module create(Long id, String title, String body) {
        return new ModuleImpl(id, title, body);
    }

}
