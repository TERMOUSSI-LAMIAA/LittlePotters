package com.littlepotters.littlepotters.services.impl;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.exceptions.ReservationException;
import com.littlepotters.littlepotters.mappers.ReservationMapper;
import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReservationServiceImpl  implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final WorkshopRepository workshopRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;

    @Override
    public ReservationResponseDTO createReservation(ReservationRequestDTO reservationRequestDTO) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User client = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservation = reservationMapper.toEntity(reservationRequestDTO);

        reservation.setClient(client);
        reservation.setStatus(ReservationStatus.PENDING);

        Reservation savedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(savedReservation);
    }

    @Override
    public ReservationResponseDTO updateReservationStatus(Long reservationId, ReservationRequestDTO reservationRequestDTO) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));
        reservationMapper.updateEntityFromDTO(reservationRequestDTO, reservation);

        Reservation updatedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(updatedReservation);
    }

    @Override
    public List<ReservationResponseDTO> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();

        return reservations.stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResponseDTO getReservationById(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));

        return reservationMapper.toDTO(reservation);
    }

    @Override
    public void deleteReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));

        reservationRepository.delete(reservation);
    }

}
