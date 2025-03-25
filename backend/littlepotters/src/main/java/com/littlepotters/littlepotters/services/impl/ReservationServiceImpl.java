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
import com.littlepotters.littlepotters.services.inter.EmailService;
import com.littlepotters.littlepotters.services.inter.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReservationServiceImpl  implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final WorkshopRepository workshopRepository;
    private final EmailService emailService;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String instructorEmail = authentication.getName();

        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        if (!isInstructorOfWorkshop(instructor, reservation.getWorkshop())) {
            throw new RuntimeException("You are not authorized to update the status of this reservation.");
        }

        reservation.setStatus(reservationRequestDTO.getStatus());
        Reservation updatedReservation = reservationRepository.save(reservation);

        if (updatedReservation.getStatus() == ReservationStatus.COMPLETED) {
            sendCompletionNotificationToCustomer(updatedReservation);
        }

        return reservationMapper.toDTO(updatedReservation);
    }
    private void sendCompletionNotificationToCustomer(Reservation reservation) {
        try {
            User customer = reservation.getCustomer();
            Workshop workshop = reservation.getWorkshop();

            // Prepare email details
            String to = customer.getEmail();
            String subject = "Workshop Completed: " + workshop.getTitle();
            String body = String.format(
                    "Dear %s,\n\n" +
                            "The workshop '%s' you reserved has been marked as completed.\n\n" +
                            "Workshop Details:\n" +
                            "Title: %s\n" +
                            "Date: %s\n\n" +
                            "Thank you for your participation!\n\n" +
                            "Best regards,\n" +
                            "Workshop Team",
                    customer.getFullname(),
                    workshop.getTitle(),
                    workshop.getTitle(),
                    workshop.getDate()
            );

            emailService.sendSimpleMessage(to, subject, body);
        } catch (Exception e) {
            System.out.println("Failed to send completion notification for reservation "
                    + reservation.getId() + ": " + e.getMessage());

        }
    }
    @Transactional
    @Override
    public ReservationResponseDTO updatePlacesBooked(Long reservationId, ReservationRequestDTO reservationRequestDTO) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationException(reservationId));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String customerEmail = authentication.getName();

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!reservation.getCustomer().equals(customer)) {
            throw new RuntimeException("You are not authorized to update this reservation.");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Cannot update places booked for a non-pending reservation");
        }

        Workshop workshop = reservation.getWorkshop();
        int currentPlacesBooked = reservation.getPlacesBooked();
        int newPlacesBooked = reservationRequestDTO.getPlacesBooked();

        if (newPlacesBooked > workshop.getAvailablePlaces() + currentPlacesBooked) {
            throw new RuntimeException("Cannot book more places than available");
        }
        double pricePerPlace = workshop.getPrice();
        double newTotalPrice = pricePerPlace * newPlacesBooked;
        workshop.setAvailablePlaces(workshop.getAvailablePlaces() + currentPlacesBooked - newPlacesBooked);
        reservation.setPlacesBooked(newPlacesBooked);
        reservation.setTotalPrice(newTotalPrice);

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String customerEmail = authentication.getName();

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!reservation.getCustomer().equals(customer)) {
            throw new RuntimeException("You are not authorized to delete this reservation.");
        }
        Workshop workshop = reservation.getWorkshop();

        workshop.setAvailablePlaces(workshop.getAvailablePlaces() + reservation.getPlacesBooked());
        workshopRepository.save(workshop);
        reservationRepository.delete(reservation);
    }
    @Override
    public Page<ReservationResponseDTO> getReservationsForInstructorWorkshops(Long workshopId,Pageable pageable) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Set<Long> workshopIds = instructor.getWorkshops().stream()
                .map(Workshop::getId)
                .collect(Collectors.toSet());

        Page<Reservation> reservationsPage;

        if (workshopId != null) {
            if (workshopIds.contains(workshopId)) {
                reservationsPage = reservationRepository.findByWorkshopId(workshopId, pageable);
            } else {
                throw new RuntimeException("Workshop not found or does not belong to the instructor");
            }
        } else {
            reservationsPage = reservationRepository.findByWorkshopIdIn(workshopIds, pageable);
        }

        return reservationsPage.map(reservationMapper::toDTO);
    }

    @Override
    public Page<ReservationResponseDTO> getReservationsForCustomerWorkshops(Long workshopId, Pageable pageable) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Page<Reservation> reservationsPage;

        if (workshopId != null) {
            reservationsPage = reservationRepository.findByCustomerIdAndWorkshopId(customer.getId(), workshopId, pageable);
        } else {
            reservationsPage = reservationRepository.findByCustomerId(customer.getId(), pageable);
        }

        return reservationsPage.map(reservationMapper::toDTO);
    }
    private boolean isInstructorOfWorkshop(User instructor, Workshop workshop) {
        return workshop.getInstructor().equals(instructor);
    }

}
