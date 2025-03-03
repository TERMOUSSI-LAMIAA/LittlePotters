package com.littlepotters.littlepotters.models.entities;

import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
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

    private String title;
    private String description;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private WorkshopLevel level;

    @Enumerated(EnumType.STRING)
    private WorkshopSchedule schedule;

    private int maxParticipants;
    private double price;

    private String imagePath;
}
