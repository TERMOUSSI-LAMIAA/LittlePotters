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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
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
            String fileName = imageStorageService.saveWorkshopImage(workshopRequestDTO.getImage());
            workshop.setImageFileName(fileName);
        }

        Workshop savedWorkshop = workshopRepository.save(workshop);

        return workshopMapper.toDTO(savedWorkshop);
    }

    @Transactional
    @Override
    public WorkshopResponseDTO updateWorkshop(Long id, WorkshopRequestDTO workshopRequestDTO,
                                              UserDetails userDetails) throws IOException {

        Workshop existingWorkshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));

        if (!existingWorkshop.getInstructor().getEmail().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("You are not authorized to update this workshop.");
        }
        if (!existingWorkshop.getReservations().isEmpty()) {
            throw new RuntimeException("Cannot update workshop with existing reservations");
        }
        workshopMapper.updateEntityFromDTO(workshopRequestDTO, existingWorkshop);

        String oldFileName = existingWorkshop.getImageFileName();
        if (workshopRequestDTO.getImage() != null && !workshopRequestDTO.getImage().isEmpty()) {
            // Save the new image and delete the old one
            String newFileName = imageStorageService.saveWorkshopImage(workshopRequestDTO.getImage());
            existingWorkshop.setImageFileName(newFileName);

            // Delete the old image if it exists
            if (oldFileName != null && !oldFileName.isEmpty()) {
                try {
                    imageStorageService.deleteWorkshopImage(oldFileName);
                } catch (IOException e) {
                    System.err.println("Warning: Could not delete old image: " + oldFileName + ". Error: " + e.getMessage());
                }
            }
        }
        // If imageFileName is explicitly set to null, remove the image
        else if (workshopRequestDTO.getImageFileName() == null) {
            existingWorkshop.setImageFileName(null);

            // Delete the old image if it exists
            if (oldFileName != null && !oldFileName.isEmpty()) {
                try {
                    imageStorageService.deleteWorkshopImage(oldFileName);
                } catch (IOException e) {
                    System.err.println("Warning: Could not delete old image: " + oldFileName + ". Error: " + e.getMessage());
                }
            }
        }
        // Otherwise, keep the existing filename
        else {
            workshopRequestDTO.setImageFileName(existingWorkshop.getImageFileName());
        }



        int originalMaxParticipants = existingWorkshop.getMaxParticipants();
        if (existingWorkshop.getMaxParticipants() !=originalMaxParticipants ) {
            existingWorkshop.setAvailablePlaces(workshopRequestDTO.getMaxParticipants());
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
    public Page<WorkshopResponseDTO> getAllWorkshops(Pageable pageable) {
        Page<Workshop> workshopsPage = workshopRepository.findAll(pageable);
        return workshopsPage.map(workshopMapper::toDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<WorkshopResponseDTO> getUpcomingWorkshops(Pageable pageable) {
        LocalDate today = LocalDate.now();
        Page<Workshop> workshopsPage= workshopRepository.findByDateGreaterThanEqual(today, pageable);
                return workshopsPage.map(workshopMapper::toDTO);
    }
    @Transactional
    @Override
    public void deleteWorkshop(Long id, UserDetails userDetails) {
        Workshop workshop = workshopRepository.findById(id)
                .orElseThrow(() -> new WorkshopException(id));

        if (!workshop.getInstructor().getEmail().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("You are not authorized to delete this workshop.");
        }
        String imageFileName = workshop.getImageFileName();

        if (imageFileName != null && !imageFileName.isEmpty()) {
            try {
                imageStorageService.deleteWorkshopImage(imageFileName);
            } catch (IOException e) {
                throw new RuntimeException("Error deleting image for workshop with id " + id, e);
            }
        }
        workshopRepository.delete(workshop);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<WorkshopResponseDTO> getWorkshopsByInstructorId(Long instructorId, Pageable pageable) {
        Page<Workshop> workshopsPage = workshopRepository.findByInstructorId(instructorId, pageable);
        return workshopsPage.map(workshopMapper::toDTO);
    }

}
