package com.littlepotters.littlepotters.services.inter;

import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;

import java.util.List;


public interface WorkshopService {

    WorkshopResponseDTO createWorkshop(WorkshopRequestDTO workshopRequestDTO);
    WorkshopResponseDTO getWorkshopById(Long id);
    List<WorkshopResponseDTO> getAllWorkshops();
    WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO);
    void deleteWorkshop(Long id);
}
