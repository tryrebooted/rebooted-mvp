package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.Content;
import rebootedmvp.Module;
import rebootedmvp.dto.NewContentDTO;
import rebootedmvp.dto.NewModuleDTO;

@Service
public class ModuleService extends ServiceType<Module, Content, NewContentDTO, NewModuleDTO> {

}
