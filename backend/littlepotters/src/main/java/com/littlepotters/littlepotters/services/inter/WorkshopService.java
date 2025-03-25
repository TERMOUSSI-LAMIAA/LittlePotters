package com.littlepotters.littlepotters.services.inter;

import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.List;


public interface WorkshopService {

    WorkshopResponseDTO createWorkshop(WorkshopRequestDTO workshopRequestDTO) throws IOException;;
    WorkshopResponseDTO getWorkshopById(Long id);
    Page<WorkshopResponseDTO> getAllWorkshops(Pageable pageable);
    void deleteWorkshop(Long id, UserDetails userDetails);
    WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO,
                                       UserDetails userDetails)throws IOException ;
    Page<WorkshopResponseDTO> getWorkshopsByInstructorId(Long instructorId, Pageable pageable);
    Page<WorkshopResponseDTO> getUpcomingWorkshops(Pageable pageable);
}
