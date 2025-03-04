package com.littlepotters.littlepotters.mappers;


import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.models.entities.Workshop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface WorkshopMapper {

    Workshop toEntity(WorkshopRequestDTO workshopRequestDTO);

    WorkshopResponseDTO toDTO(Workshop workshop);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(WorkshopRequestDTO workshopRequestDTO, @MappingTarget Workshop workshop);
}
