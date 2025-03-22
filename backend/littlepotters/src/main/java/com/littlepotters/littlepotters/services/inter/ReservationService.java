package com.littlepotters.littlepotters.services.inter;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReservationService {
    ReservationResponseDTO createReservation(ReservationRequestDTO reservationRequestDTO);

    ReservationResponseDTO updateReservationStatus(Long reservationId, ReservationRequestDTO reservationRequestDTO);

    List<ReservationResponseDTO> getAllReservations();

    ReservationResponseDTO getReservationById(Long reservationId);
    void deleteReservation(Long reservationId);
    Page<ReservationResponseDTO> getReservationsForInstructorWorkshops(Long workshopId,Pageable pageable);
    ReservationResponseDTO updatePlacesBooked(Long reservationId, ReservationRequestDTO reservationRequestDTO);

//    List<ReservationResponseDTO> getReservationsForCustomer();
//
//    List<ReservationResponseDTO> getReservationsForInstructor();

}
