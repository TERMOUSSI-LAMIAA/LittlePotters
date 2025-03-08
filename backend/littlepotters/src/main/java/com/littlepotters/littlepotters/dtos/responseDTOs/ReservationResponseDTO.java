package com.littlepotters.littlepotters.dtos.responseDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponseDTO {

    private Long id;
    private LocalDateTime reservationDate;
    private String status;
    private Long customerId;
    private Long workshopId;
    private Integer placesBooked;
    private double totalPrice;
}
