package com.littlepotters.littlepotters.mappers;

import com.littlepotters.littlepotters.dtos.requestDTOs.RoleRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.RoleResponseDTO;
import com.littlepotters.littlepotters.models.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface RoleMapper {

    RoleResponseDTO toDTO(Role role);

    Role toEntity(RoleRequestDTO roleRequestDTO);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(RoleRequestDTO roleRequestDTO, @MappingTarget Role role);

}
