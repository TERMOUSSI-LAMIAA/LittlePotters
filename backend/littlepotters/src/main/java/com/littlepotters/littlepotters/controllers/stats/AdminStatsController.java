package com.littlepotters.littlepotters.controllers.stats;

import com.littlepotters.littlepotters.services.inter.stats.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {
    private final AdminStatsService adminStatsService;

    @GetMapping
    public Map<String, Object> getAdminStats() {
        return adminStatsService.getAdminStatistics();
    }
}
