package com.littlepotters.littlepotters.mappers;


import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.util.ImageUrlGenerator;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",uses = {ImageUrlGenerator.class})
@Component
public interface WorkshopMapper {
    @Mapping(target = "instructor", ignore = true)
    @Mapping(target = "imageFileName", source = "image.originalFilename")
    Workshop toEntity(WorkshopRequestDTO workshopRequestDTO);

    @Mapping(target = "imageUrl", source = "imageFileName",qualifiedByName = "generateWorkshopImageUrl")
    @Mapping(target = "instructorId", source = "instructor.id")
    WorkshopResponseDTO toDTO(Workshop workshop);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructor", ignore = true)
    @Mapping(target = "imageFileName", expression = "java(mapImageFileName(workshopRequestDTO, workshop))")
    void updateEntityFromDTO(WorkshopRequestDTO workshopRequestDTO, @MappingTarget Workshop workshop);

    default String mapImageFileName(WorkshopRequestDTO workshopRequestDTO, Workshop workshop) {
        if (workshopRequestDTO.getImage() == null || workshopRequestDTO.getImage().isEmpty()) {
            return workshop.getImageFileName();
        }

        return workshopRequestDTO.getImage().getOriginalFilename();
    }
}
