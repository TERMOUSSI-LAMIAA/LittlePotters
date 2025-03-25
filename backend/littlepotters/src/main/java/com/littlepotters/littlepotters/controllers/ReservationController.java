package com.littlepotters.littlepotters.controllers;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.services.inter.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/{reservationId}/status")
    public ResponseEntity<ReservationResponseDTO> updateReservationStatus(@PathVariable Long reservationId, @RequestBody ReservationRequestDTO reservationRequestDTO) {
        ReservationResponseDTO reservationResponseDTO = reservationService.updateReservationStatus(reservationId, reservationRequestDTO);
        return ResponseEntity.ok(reservationResponseDTO);
    }

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

    @PreAuthorize("hasRole('ADMIN')") //??
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

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/workshops")
    public ResponseEntity<Page<ReservationResponseDTO>> getCustomerWorkshopReservations(
            @RequestParam(required = false) Long workshopId,
            Pageable pageable) {

        Page<ReservationResponseDTO> reservations = reservationService
                .getReservationsForCustomerWorkshops(workshopId, pageable);

        return ResponseEntity.ok(reservations);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/instructor/workshops")
    public ResponseEntity<Page<ReservationResponseDTO>> getInstructorWorkshopReservations(
            @RequestParam(required = false) Long workshopId,Pageable pageable) {
        Page<ReservationResponseDTO> reservations = reservationService.getReservationsForInstructorWorkshops(
                workshopId,pageable);
        return ResponseEntity.ok(reservations);
    }


}
