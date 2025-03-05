package com.littlepotters.littlepotters.mappers;


import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.util.ImageUrlGenerator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",uses = {ImageUrlGenerator.class})
@Component
public interface WorkshopMapper {
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "imageFileName", source = "image.originalFilename")
    Workshop toEntity(WorkshopRequestDTO workshopRequestDTO);

    // Use the ImageUrlGenerator to generate the image URL
    @Mapping(target = "imageUrl", qualifiedByName = "generateImageUrl")
    WorkshopResponseDTO toDTO(Workshop workshop);

    @Named("generateImageUrl")
    default String generateImageUrl(String imageFileName, ImageUrlGenerator imageUrlGenerator) {
        return imageUrlGenerator.generateImageUrl(imageFileName);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updateEntityFromDTO(WorkshopRequestDTO workshopRequestDTO, @MappingTarget Workshop workshop);
}
