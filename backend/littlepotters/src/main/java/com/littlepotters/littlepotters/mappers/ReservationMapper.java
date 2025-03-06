package com.littlepotters.littlepotters.mappers;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.models.entities.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface ReservationMapper {

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "workshop", source = "workshopId")
    Reservation toEntity(ReservationRequestDTO reservationRequestDTO);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "workshopId", source = "workshop.id")
    ReservationResponseDTO toDTO(Reservation reservation);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "workshop", ignore = true)
    void updateEntityFromDTO(ReservationRequestDTO reservationRequestDTO, @MappingTarget Reservation reservation);
}
