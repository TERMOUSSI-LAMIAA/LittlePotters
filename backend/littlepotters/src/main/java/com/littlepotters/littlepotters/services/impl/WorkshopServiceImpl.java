package com.littlepotters.littlepotters.services.impl;


import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.exceptions.WorkshopException;
import com.littlepotters.littlepotters.mappers.WorkshopMapper;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.inter.WorkshopService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserRepository userRepository;

    private final ImageStorageService imageStorageService;
//TODO: when delete a workshop notify the clients with reservations + cannot delete a workhop with date has passed
// + when delete workshop delete its reservations
    //TODO: delete old imge while updating (check content-type in header)
    //TODO: update & delete the workshop by its instructor not any instructor
    @Transactional
    @Override
    public WorkshopResponseDTO createWorkshop(WorkshopRequestDTO workshopRequestDTO) throws IOException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User instructor = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Workshop workshop = workshopMapper.toEntity(workshopRequestDTO);
        workshop.setInstructor(instructor);
        workshop.setAvailablePlaces(workshop.getMaxParticipants());

        if (workshopRequestDTO.getImage() != null && !workshopRequestDTO.getImage().isEmpty()) {
            String fileName = imageStorageService.saveImage(workshopRequestDTO.getImage());
            workshop.setImageFileName(fileName);
        }

        Workshop savedWorkshop = workshopRepository.save(workshop);

        return workshopMapper.toDTO(savedWorkshop);
    }

    @Transactional
    @Override
    public WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO) throws IOException {

        Workshop existingWorkshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));


        if (!existingWorkshop.getReservations().isEmpty()) {
            throw new RuntimeException("Cannot update workshop with existing reservations");
        }

        String oldFileName = existingWorkshop.getImageFileName();

        if (workshopRequestDTO.getImage() != null && !workshopRequestDTO.getImage().isEmpty()) {
            String newFileName = imageStorageService.saveImage(workshopRequestDTO.getImage());

            existingWorkshop.setImageFileName(newFileName);
        }

        int originalMaxParticipants = existingWorkshop.getMaxParticipants();
        workshopMapper.updateEntityFromDTO(workshopRequestDTO, existingWorkshop);
        if (existingWorkshop.getMaxParticipants() !=originalMaxParticipants ) {
            existingWorkshop.setAvailablePlaces(workshopRequestDTO.getMaxParticipants());
        }

        Workshop updatedWorkshop = workshopRepository.save(existingWorkshop);
        if (oldFileName != null && !oldFileName.isEmpty()
                && workshopRequestDTO.getImage() != null
                && !workshopRequestDTO.getImage().isEmpty()) {
            try {
                imageStorageService.deleteImage(oldFileName);
            } catch (IOException e) {
                System.err.println("Warning: Could not delete old image: " + oldFileName + ". Error: " + e.getMessage());
            }
        }
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
