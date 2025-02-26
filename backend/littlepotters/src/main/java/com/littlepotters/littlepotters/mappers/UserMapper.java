package com.littlepotters.littlepotters.mappers;

import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.models.Role;
import com.littlepotters.littlepotters.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
@Component
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    User toEntity(UserRequestDTO userRequestDTO);

    @Mapping(source = "roles", target = "roles")
    UserResponseDTO toDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateEntityFromDTO(UserRequestDTO userRequestDTO, @MappingTarget User user);

    default Set<String> map(Set<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

}
