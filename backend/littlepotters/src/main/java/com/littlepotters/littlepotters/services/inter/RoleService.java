package com.littlepotters.littlepotters.services.inter;

import com.littlepotters.littlepotters.dtos.requestDTOs.RoleRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.RoleResponseDTO;

import java.util.List;

public interface RoleService {

    RoleResponseDTO createRole(RoleRequestDTO roleRequestDTO);
    List<RoleResponseDTO> getAllRoles();
    RoleResponseDTO getRoleById(Long id);
}
