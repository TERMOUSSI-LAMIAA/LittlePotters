package com.littlepotters.littlepotters.services.impl;

import com.littlepotters.littlepotters.dtos.requestDTOs.RoleRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.RoleResponseDTO;
import com.littlepotters.littlepotters.exceptions.RoleException;
import com.littlepotters.littlepotters.mappers.RoleMapper;
import com.littlepotters.littlepotters.models.entities.Role;
import com.littlepotters.littlepotters.repositories.RoleRepository;
import com.littlepotters.littlepotters.services.inter.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    public RoleResponseDTO createRole(RoleRequestDTO roleRequestDTO) {
        Role role = roleMapper.toEntity(roleRequestDTO);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }

    @Override
    public List<RoleResponseDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(roleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponseDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleException(id));
        return roleMapper.toDTO(role);
    }
}
