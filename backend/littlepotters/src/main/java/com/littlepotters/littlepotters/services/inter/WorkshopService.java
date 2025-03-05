package com.littlepotters.littlepotters.services.inter;

import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;

import java.io.IOException;
import java.util.List;


public interface WorkshopService {

    WorkshopResponseDTO createWorkshop(WorkshopRequestDTO workshopRequestDTO) throws IOException;;
    WorkshopResponseDTO getWorkshopById(Long id);
    List<WorkshopResponseDTO> getAllWorkshops();
    WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO) throws IOException;;
    void deleteWorkshop(Long id);
}
