package com.littlepotters.littlepotters.services.impl;


import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.exceptions.WorkshopException;
import com.littlepotters.littlepotters.mappers.WorkshopMapper;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.WorkshopService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class WorkshopServiceImpl implements WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final WorkshopMapper workshopMapper;

    @Override
    public WorkshopResponseDTO createWorkshop(WorkshopRequestDTO workshopRequestDTO) {
        Workshop workshop = workshopMapper.toEntity(workshopRequestDTO);
        Workshop savedWorkshop = workshopRepository.save(workshop);
        return workshopMapper.toDTO(savedWorkshop);
    }

    @Override
    public WorkshopResponseDTO getWorkshopById(Long id) {
        Workshop workshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));
        return workshopMapper.toDTO(workshop);
    }

    @Override
    public List<WorkshopResponseDTO> getAllWorkshops() {
        List<Workshop> workshops = workshopRepository.findAll();
        return workshops.stream()
                .map(workshopMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO) {
        Workshop existingWorkshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));

        workshopMapper.updateEntityFromDTO(workshopRequestDTO, existingWorkshop);
        Workshop updatedWorkshop = workshopRepository.save(existingWorkshop);
        return workshopMapper.toDTO(updatedWorkshop);
    }

    @Override
    public void deleteWorkshop(Long id) {
        if (!workshopRepository.existsById(id)) {
            throw new WorkshopException(id);
        }
        workshopRepository.deleteById(id);
    }
}
