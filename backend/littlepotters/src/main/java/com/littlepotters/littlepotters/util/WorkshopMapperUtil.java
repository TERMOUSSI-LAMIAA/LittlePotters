package com.littlepotters.littlepotters.util;

import com.littlepotters.littlepotters.exceptions.WorkshopException;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class WorkshopMapperUtil {

    private final WorkshopRepository workshopRepository;

    @Named("mapWorkshopIdToEntity")
    public Workshop mapWorkshopIdToEntity(Long workshopId) {
        return workshopRepository.findById(workshopId).orElseThrow(() -> new WorkshopException(workshopId));
    }
}
