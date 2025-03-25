package com.littlepotters.littlepotters.services.inter.stats;

import java.util.Map;

public interface CustomerStatisticsService {
    Map<String, Object> getCustomerStatistics(Long customerId);
}
