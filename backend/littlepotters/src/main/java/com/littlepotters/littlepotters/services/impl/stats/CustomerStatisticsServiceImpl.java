package com.littlepotters.littlepotters.services.impl.stats;

import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.stats.CustomerStatisticsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class CustomerStatisticsServiceImpl  implements CustomerStatisticsService {
    private final ReservationRepository reservationRepository;
    private final WorkshopRepository workshopRepository;

    @Override
    public Map<String, Object> getCustomerStatistics(Long customerId) {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalReservations", reservationRepository.countByCustomerId(customerId));

        stats.put("totalSpent", reservationRepository.sumCompletedReservationsByCustomerId(customerId));
        stats.put("mostExpensiveReservation", reservationRepository.findMaxCompletedReservationPriceByCustomerId(customerId));

        stats.put("timePreference", getTimePreference(customerId));

        stats.put("mostFrequentInstructor", getMostFrequentInstructor(customerId));

        return stats;
    }

    private Map<String, Long> getTimePreference(Long customerId) {
        Map<String, Long> timeMap = new HashMap<>();
        timeMap.put("MORNING", workshopRepository.countByReservationsCustomerIdAndSchedule(customerId, WorkshopSchedule.MORNING));
        timeMap.put("AFTERNOON", workshopRepository.countByReservationsCustomerIdAndSchedule(customerId, WorkshopSchedule.AFTERNOON));
        timeMap.put("EVENING", workshopRepository.countByReservationsCustomerIdAndSchedule(customerId, WorkshopSchedule.EVENING));
        return timeMap;
    }

    private Map<String, Object> getMostFrequentInstructor(Long customerId) {
        List<Object[]> results = reservationRepository.findInstructorBookingCounts(customerId);
        if (results.isEmpty()) {
            Map<String, Object> defaultResult = new HashMap<>();
            defaultResult.put("name", "N/A");
            defaultResult.put("count", 0);
            return defaultResult;
        }

        Object[] topResult = results.get(0);
        Long instructorId = (Long) topResult[0];
        String instructorName = (String) topResult[1];
        Long count = (Long) topResult[2];

        Map<String, Object> instructorInfo = new HashMap<>();
        instructorInfo.put("id", instructorId);
        instructorInfo.put("name", instructorName);
        instructorInfo.put("count", count);

        return instructorInfo;
    }
}
