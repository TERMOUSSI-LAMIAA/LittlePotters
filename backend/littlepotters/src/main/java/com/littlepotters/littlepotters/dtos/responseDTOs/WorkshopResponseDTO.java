package com.littlepotters.littlepotters.dtos.responseDTOs;

import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkshopResponseDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private WorkshopLevel level;
    private WorkshopSchedule schedule;
    private int maxParticipants;
    private double price;
    private String imageUrl;
    private Long instructorId;
    private int availablePlaces;


}
