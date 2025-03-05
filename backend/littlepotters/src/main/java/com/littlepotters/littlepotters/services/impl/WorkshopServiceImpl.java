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
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class WorkshopServiceImpl implements WorkshopService {
    private final WorkshopRepository workshopRepository;
    private final WorkshopMapper workshopMapper;
    private final ImageStorageService imageStorageService;

    @Transactional
    @Override
    public WorkshopResponseDTO createWorkshop(WorkshopRequestDTO workshopRequestDTO) throws IOException {
        if (workshopRequestDTO.getImage() != null && !workshopRequestDTO.getImage().isEmpty()) {
            String fileName = imageStorageService.saveImage(workshopRequestDTO.getImage());

            Workshop workshop = workshopMapper.toEntity(workshopRequestDTO);
            workshop.setImageFileName(fileName);

            Workshop savedWorkshop = workshopRepository.save(workshop);

            return workshopMapper.toDTO(savedWorkshop);
        }

        Workshop workshop = workshopMapper.toEntity(workshopRequestDTO);
        Workshop savedWorkshop = workshopRepository.save(workshop);
        return workshopMapper.toDTO(savedWorkshop);
    }

    @Transactional
    @Override
    public WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO) throws IOException {
        Workshop existingWorkshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));

        if (workshopRequestDTO.getImage() != null && !workshopRequestDTO.getImage().isEmpty()) {
            String newFileName = imageStorageService.saveImage(workshopRequestDTO.getImage());
            workshopRequestDTO.setImage(null);

            workshopMapper.updateEntityFromDTO(workshopRequestDTO, existingWorkshop);
            existingWorkshop.setImageFileName(newFileName);
        } else {
            workshopMapper.updateEntityFromDTO(workshopRequestDTO, existingWorkshop);
        }

        Workshop updatedWorkshop = workshopRepository.save(existingWorkshop);
        return workshopMapper.toDTO(updatedWorkshop);
    }

    @Transactional(readOnly = true)
    @Override
    public WorkshopResponseDTO getWorkshopById(Long id) {
        Workshop workshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));
        return workshopMapper.toDTO(workshop);
    }

    @Transactional(readOnly = true)
    @Override
    public List<WorkshopResponseDTO> getAllWorkshops() {
        List<Workshop> workshops = workshopRepository.findAll();
        return workshops.stream()
                .map(workshopMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deleteWorkshop(Long id) {
        Workshop workshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));
        String imageFileName = workshop.getImageFileName();

        if (imageFileName != null && !imageFileName.isEmpty()) {
            try {
                imageStorageService.deleteImage(imageFileName);
            } catch (IOException e) {
                throw new RuntimeException("Error deleting image for workshop with id " + id, e);
            }
        }
        workshopRepository.delete(workshop);
    }
}
