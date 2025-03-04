package com.littlepotters.littlepotters.models.entities;

import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "workshops")
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String description;

    @NotNull(message = "Date cannot be null")
    @FutureOrPresent(message = "Date must be today or in the future")
    private LocalDate date;

    @NotNull(message = "Level is required")
    @Enumerated(EnumType.STRING)
    private WorkshopLevel level;

    @NotNull(message = "Schedule is required")
    @Enumerated(EnumType.STRING)
    private WorkshopSchedule schedule;

    @Min(value = 1, message = "At least 1 participant is required")
    @Max(value = 20, message = "Cannot have more than 20 participants")
    private int maxParticipants;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private double price;

    private String imagePath;
}
