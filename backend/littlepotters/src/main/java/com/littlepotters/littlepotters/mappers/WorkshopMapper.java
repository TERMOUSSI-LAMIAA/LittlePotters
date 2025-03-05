package com.littlepotters.littlepotters.mappers;


import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.util.ImageUrlGenerator;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",uses = {ImageUrlGenerator.class})
@Component
public interface WorkshopMapper {

    @Mapping(target = "imageFileName", source = "image.originalFilename")
    Workshop toEntity(WorkshopRequestDTO workshopRequestDTO);

    @Mapping(target = "imageUrl", source = "imageFileName",qualifiedByName = "generateImageUrl")
    WorkshopResponseDTO toDTO(Workshop workshop);



    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(WorkshopRequestDTO workshopRequestDTO, @MappingTarget Workshop workshop);
}
