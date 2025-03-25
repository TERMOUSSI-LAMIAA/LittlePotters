package com.littlepotters.littlepotters.controllers.stats;

import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.stats.InstructorStatsService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/instructor/stats")
@AllArgsConstructor
public class InstructorStatsController {

    private final InstructorStatsService statsService;

    @GetMapping("/{instructorId}")
    public Map<String, Object> getInstructorStats(@PathVariable Long instructorId) {
        return statsService.getInstructorStatistics(instructorId);
    }
}
