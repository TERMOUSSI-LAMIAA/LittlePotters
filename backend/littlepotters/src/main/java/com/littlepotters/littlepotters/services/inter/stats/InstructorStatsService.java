package com.littlepotters.littlepotters.services.inter.stats;

import java.util.Map;

public interface InstructorStatsService {
    Map<String, Object> getInstructorStatistics(Long instructorId);
}
