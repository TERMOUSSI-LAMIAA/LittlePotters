package com.littlepotters.littlepotters.mappers;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.exceptions.WorkshopException;
import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.util.WorkshopMapperUtil;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {WorkshopMapperUtil.class})
@Component
public interface ReservationMapper {

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "workshop", source = "workshopId", qualifiedByName = "mapWorkshopIdToEntity")
    Reservation toEntity(ReservationRequestDTO reservationRequestDTO);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "workshopId", source = "workshop.id")
    ReservationResponseDTO toDTO(Reservation reservation);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "workshop", ignore = true)
    void updateEntityFromDTO(ReservationRequestDTO reservationRequestDTO, @MappingTarget Reservation reservation);


}
