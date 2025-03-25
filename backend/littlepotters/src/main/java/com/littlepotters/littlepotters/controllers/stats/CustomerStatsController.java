package com.littlepotters.littlepotters.controllers.stats;

import com.littlepotters.littlepotters.services.inter.stats.CustomerStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/stats")
@RequiredArgsConstructor
public class CustomerStatsController {

    private final CustomerStatisticsService statsService;

    @GetMapping("/{customerId}")
    public Map<String, Object> getCustomerStats(@PathVariable Long customerId) {
        return statsService.getCustomerStatistics(customerId);
    }
}
