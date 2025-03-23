package com.littlepotters.littlepotters.mappers;

import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.models.entities.Role;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.util.ImageUrlGenerator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {ImageUrlGenerator.class})
@Component
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "imageFileName", source = "image.originalFilename")
    User toEntity(UserRequestDTO userRequestDTO);

    @Mapping(source = "roles", target = "roles")
    @Mapping(target = "imageUrl", source = "imageFileName", qualifiedByName = "generateProfileImageUrl")
    UserResponseDTO toDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "imageFileName", expression = "java(mapImageFileName(userRequestDTO, user))")
    @Mapping(target = "password", ignore = true)
    void updateEntityFromDTO(UserRequestDTO userRequestDTO, @MappingTarget User user);

    default String mapImageFileName(UserRequestDTO userRequestDTO, User user) {
        if (userRequestDTO.getImage() == null || userRequestDTO.getImage().isEmpty()) {
            return user.getImageFileName();
        }
        return userRequestDTO.getImage().getOriginalFilename();
    }

    default Set<String> map(Set<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

}
