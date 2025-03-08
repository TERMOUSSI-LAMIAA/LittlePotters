package com.littlepotters.littlepotters.services.impl;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.exceptions.ReservationException;
import com.littlepotters.littlepotters.exceptions.WorkshopException;
import com.littlepotters.littlepotters.mappers.ReservationMapper;
import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReservationServiceImpl  implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final WorkshopRepository workshopRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
//TODO:check the available seats for each workshop if its == the max participants
// then disable the reservation possibility and can't reserv an old workshop

    @Transactional
    @Override
    public ReservationResponseDTO createReservation(ReservationRequestDTO reservationRequestDTO) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User customer = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Workshop workshop = workshopRepository.findById(reservationRequestDTO.getWorkshopId())
                .orElseThrow(() -> new WorkshopException(reservationRequestDTO.getWorkshopId()));

        if (reservationRepository.existsByCustomerAndWorkshop(customer, workshop)) {
            throw new RuntimeException("You have already reserved this workshop.");
        }

        if (reservationRequestDTO.getPlacesBooked() > workshop.getAvailablePlaces()) {
            throw new RuntimeException("Insufficient available places for booking. Requested: "
                    + reservationRequestDTO.getPlacesBooked() + ", Available: " + workshop.getAvailablePlaces());
        }
        Reservation reservation = reservationMapper.toEntity(reservationRequestDTO);

        reservation.setCustomer(customer);
        reservation.setStatus(ReservationStatus.PENDING);
        double totalPrice = workshop.getPrice() * reservationRequestDTO.getPlacesBooked();
        reservation.setTotalPrice(totalPrice);
        reservation.setWorkshop(workshop);
        workshop.setAvailablePlaces(workshop.getAvailablePlaces() - reservationRequestDTO.getPlacesBooked());
        workshopRepository.save(workshop);
        Reservation savedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(savedReservation);
    }

    @Override
    public ReservationResponseDTO updateReservationStatus(Long reservationId, ReservationRequestDTO reservationRequestDTO) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));
        reservation.setStatus(reservationRequestDTO.getStatus());
        Reservation updatedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(updatedReservation);
    }

    @Transactional
    @Override
    public ReservationResponseDTO updatePlacesBooked(Long reservationId, ReservationRequestDTO reservationRequestDTO) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Cannot update places booked for a non-pending reservation");
        }

        Workshop workshop = reservation.getWorkshop();
        int currentPlacesBooked = reservation.getPlacesBooked();

        if (reservationRequestDTO.getPlacesBooked() > workshop.getAvailablePlaces() + currentPlacesBooked) {
            throw new RuntimeException("Cannot book more places than available");
        }

        workshop.setAvailablePlaces(workshop.getAvailablePlaces() + currentPlacesBooked - reservationRequestDTO.getPlacesBooked());
        reservation.setPlacesBooked(reservationRequestDTO.getPlacesBooked());

        workshopRepository.save(workshop);
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
    @Transactional
    @Override
    public void deleteReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));
        Workshop workshop = reservation.getWorkshop();

        workshop.setAvailablePlaces(workshop.getAvailablePlaces() + reservation.getPlacesBooked());
        workshopRepository.save(workshop);
        reservationRepository.delete(reservation);
    }

    @Override
    public List<ReservationResponseDTO> getReservationsForCustomer() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Reservation> reservations = reservationRepository.findByCustomer(customer);
        return reservations.stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponseDTO> getReservationsForInstructor() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        List<Workshop> workshops = workshopRepository.findByInstructor(instructor);

        List<Reservation> reservations = new ArrayList<>();
        for (Workshop workshop : workshops) {
            reservations.addAll(reservationRepository.findByWorkshop(workshop));
        }

        return reservations.stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

}
