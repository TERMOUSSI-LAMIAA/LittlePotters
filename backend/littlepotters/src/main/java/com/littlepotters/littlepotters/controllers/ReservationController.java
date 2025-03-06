package com.littlepotters.littlepotters.controllers;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.services.inter.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(@RequestBody ReservationRequestDTO reservationRequestDTO) {
        ReservationResponseDTO reservationResponseDTO = reservationService.createReservation(reservationRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationResponseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> updateReservationStatus(@PathVariable Long id, @RequestBody ReservationRequestDTO reservationRequestDTO) {
        ReservationResponseDTO reservationResponseDTO = reservationService.updateReservationStatus(id, reservationRequestDTO);
        return ResponseEntity.ok(reservationResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations() {
        List<ReservationResponseDTO> reservationResponseDTOS = reservationService.getAllReservations();
        return ResponseEntity.ok(reservationResponseDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Long id) {
        ReservationResponseDTO reservationResponseDTO = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservationResponseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
