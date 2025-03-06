package com.littlepotters.littlepotters.dtos.requestDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequestDTO {

    @NotNull(message = "Workshop ID is required")
    private Long workshopId;
}
