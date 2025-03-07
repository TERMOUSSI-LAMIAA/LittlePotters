package com.littlepotters.littlepotters.dtos.requestDTOs;

import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequestDTO {

    @NotNull(message = "Workshop ID is required")
    private Long workshopId;

    @Min(1)
    private Integer placesBooked = 1;

    private ReservationStatus status;
}
