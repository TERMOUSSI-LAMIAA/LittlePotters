package com.littlepotters.littlepotters.controllers;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.services.inter.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@AllArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(@RequestBody ReservationRequestDTO reservationRequestDTO) {
        ReservationResponseDTO reservationResponseDTO = reservationService.createReservation(reservationRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationResponseDTO);
    }
//TODO:the update should be handled by the instructor of the workshop reserved not any instrucor
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/{reservationId}/status")
    public ResponseEntity<ReservationResponseDTO> updateReservationStatus(@PathVariable Long reservationId, @RequestBody ReservationRequestDTO reservationRequestDTO) {
        ReservationResponseDTO reservationResponseDTO = reservationService.updateReservationStatus(reservationId, reservationRequestDTO);
        return ResponseEntity.ok(reservationResponseDTO);
    }
//TODO:the update should be handled by the customer of the workshop reserved not any customer

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{reservationId}/places")
    public ResponseEntity<ReservationResponseDTO> updatePlacesBooked(@PathVariable Long reservationId, @RequestBody ReservationRequestDTO reservationRequestDTO) {
        ReservationResponseDTO reservationResponseDTO = reservationService.updatePlacesBooked(reservationId, reservationRequestDTO);
        return ResponseEntity.ok(reservationResponseDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations() {
        List<ReservationResponseDTO> reservationResponseDTOS = reservationService.getAllReservations();
        return ResponseEntity.ok(reservationResponseDTOS);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Long id) {
        ReservationResponseDTO reservationResponseDTO = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservationResponseDTO);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReservationResponseDTO>> getCustomerReservations() {
        List<ReservationResponseDTO> reservations = reservationService.getReservationsForCustomer();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/instructor")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<ReservationResponseDTO>> getInstructorReservations() {
        List<ReservationResponseDTO> reservations = reservationService.getReservationsForInstructor();
        return ResponseEntity.ok(reservations);
    }
}
