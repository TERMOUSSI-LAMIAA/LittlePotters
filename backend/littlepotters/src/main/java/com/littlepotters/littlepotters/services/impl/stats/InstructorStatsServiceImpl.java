package com.littlepotters.littlepotters.services.impl.stats;

import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.stats.InstructorStatsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class InstructorStatsServiceImpl implements InstructorStatsService {

    private final WorkshopRepository workshopRepo;
    private final ReservationRepository reservationRepo;

    @Override
    public Map<String, Object> getInstructorStatistics(Long instructorId) {
        Map<String, Object> stats = new HashMap<>();


        stats.put("totalWorkshops", workshopRepo.countByInstructorId(instructorId));
        stats.put("totalReservations", reservationRepo.countByWorkshopInstructorId(instructorId));

        stats.put("reservationsByStatus", getReservationsByStatus(instructorId));

        stats.put("workshopsByLevel", getWorkshopsByLevel(instructorId));
        stats.put("workshopsBySchedule", getWorkshopsBySchedule(instructorId));

        return stats;
    }

    private Map<String, Long> getReservationsByStatus(Long instructorId) {
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("PENDING", reservationRepo.countByWorkshopInstructorIdAndStatus(
                instructorId, ReservationStatus.PENDING));
        statusMap.put("CONFIRMED", reservationRepo.countByWorkshopInstructorIdAndStatus(
                instructorId, ReservationStatus.CONFIRMED));
        statusMap.put("CANCELLED", reservationRepo.countByWorkshopInstructorIdAndStatus(
                instructorId, ReservationStatus.CANCELLED));
        statusMap.put("COMPLETED", reservationRepo.countByWorkshopInstructorIdAndStatus(
                instructorId, ReservationStatus.COMPLETED));
        return statusMap;
    }

    private Map<String, Long> getWorkshopsByLevel(Long instructorId) {
        Map<String, Long> levelMap = new HashMap<>();
        levelMap.put("BEGINNER", workshopRepo.countByInstructorIdAndLevel(
                instructorId, WorkshopLevel.BEGINNER));
        levelMap.put("INTERMEDIATE", workshopRepo.countByInstructorIdAndLevel(
                instructorId, WorkshopLevel.INTERMEDIATE));
        levelMap.put("ADVANCED", workshopRepo.countByInstructorIdAndLevel(
                instructorId, WorkshopLevel.ADVANCED));
        return levelMap;
    }

    private Map<String, Long> getWorkshopsBySchedule(Long instructorId) {
        Map<String, Long> scheduleMap = new HashMap<>();
        scheduleMap.put("MORNING", workshopRepo.countByInstructorIdAndSchedule(
                instructorId, WorkshopSchedule.MORNING));
        scheduleMap.put("AFTERNOON", workshopRepo.countByInstructorIdAndSchedule(
                instructorId, WorkshopSchedule.AFTERNOON));
        scheduleMap.put("EVENING", workshopRepo.countByInstructorIdAndSchedule(
                instructorId, WorkshopSchedule.EVENING));
        return scheduleMap;
    }
}
