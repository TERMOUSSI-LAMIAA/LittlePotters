package com.littlepotters.littlepotters.services.impl.stats;

import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.stats.AdminStatsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class AdminStatsServiceImpl  implements AdminStatsService {
    private final UserRepository userRepository;
    private final WorkshopRepository workshopRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public Map<String, Object> getAdminStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalInstructors", userRepository.countByRoleName("INSTRUCTOR"));

        stats.put("totalCustomers", userRepository.countByRoleName("CUSTOMER"));

        stats.put("totalReservations", reservationRepository.count());
        stats.put("reservationCancellationRate", getCancellationRate());

        stats.put("totalWorkshops", workshopRepository.count());
        stats.put("workshopsByLevel", getWorkshopsByLevel());
        stats.put("workshopsBySchedule", getWorkshopsBySchedule());

        stats.put("totalRevenue", getTotalRevenueFromCompletedReservations());

        return stats;
    }

    private double getCancellationRate() {
        long totalReservations = reservationRepository.count();
        if (totalReservations == 0) return 0.0;

        long cancelledReservations = reservationRepository.countByStatus(ReservationStatus.CANCELLED);
        return ((double) cancelledReservations / totalReservations) * 100;
    }

    private Map<String, Long> getWorkshopsByLevel() {
        Map<String, Long> levelMap = new HashMap<>();
        levelMap.put("BEGINNER", workshopRepository.countByLevel(WorkshopLevel.BEGINNER));
        levelMap.put("INTERMEDIATE", workshopRepository.countByLevel(WorkshopLevel.INTERMEDIATE));
        levelMap.put("ADVANCED", workshopRepository.countByLevel(WorkshopLevel.ADVANCED));
        return levelMap;
    }

    private Map<String, Long> getWorkshopsBySchedule() {
        Map<String, Long> scheduleMap = new HashMap<>();
        scheduleMap.put("MORNING", workshopRepository.countBySchedule(WorkshopSchedule.MORNING));
        scheduleMap.put("AFTERNOON", workshopRepository.countBySchedule(WorkshopSchedule.AFTERNOON));
        scheduleMap.put("EVENING", workshopRepository.countBySchedule(WorkshopSchedule.EVENING));
        return scheduleMap;
    }

    private double getTotalRevenueFromCompletedReservations() {
        Double total = reservationRepository.sumTotalPriceByCompletedStatus();
        return total != null ? total : 0.0;
    }
}
