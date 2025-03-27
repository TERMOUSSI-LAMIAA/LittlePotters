package com.littlepotters.littlepotters;

import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.exceptions.WorkshopException;
import com.littlepotters.littlepotters.mappers.WorkshopMapper;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.models.enums.WorkshopLevel;
import com.littlepotters.littlepotters.models.enums.WorkshopSchedule;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.impl.ImageStorageService;
import com.littlepotters.littlepotters.services.impl.WorkshopServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class WorkshopServiceImplTest {

    @Mock
    private WorkshopRepository workshopRepository;

    @Mock
    private WorkshopMapper workshopMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ImageStorageService imageStorageService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private WorkshopServiceImpl workshopService;

    private User instructor;
    private Workshop workshop;
    private WorkshopRequestDTO workshopRequestDTO;
    private WorkshopResponseDTO workshopResponseDTO;
    private MultipartFile mockImage;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Set up test data
        instructor = new User();
        instructor.setId(1L);
        instructor.setEmail("instructor@example.com");
        instructor.setFullname("Test Instructor");

        workshop = new Workshop();
        workshop.setId(1L);
        workshop.setTitle("Pottery Workshop");
        workshop.setDescription("Learn pottery basics");
        workshop.setDate(LocalDate.now().plusDays(7));
        workshop.setLevel(WorkshopLevel.BEGINNER);
        workshop.setSchedule(WorkshopSchedule.MORNING);
        workshop.setMaxParticipants(10);
        workshop.setAvailablePlaces(10);
        workshop.setPrice(50.0);
        workshop.setInstructor(instructor);
        workshop.setImageFileName("workshop1.jpg");
        workshop.setReservations(new HashSet<>());

        workshopRequestDTO = new WorkshopRequestDTO();
        workshopRequestDTO.setTitle("Pottery Workshop");
        workshopRequestDTO.setDescription("Learn pottery basics");
        workshopRequestDTO.setDate(LocalDate.now().plusDays(7));
        workshopRequestDTO.setLevel(WorkshopLevel.BEGINNER);
        workshopRequestDTO.setSchedule(WorkshopSchedule.MORNING);
        workshopRequestDTO.setMaxParticipants(10);
        workshopRequestDTO.setPrice(50.0);
        workshopRequestDTO.setImageFileName("workshop1.jpg");

        workshopResponseDTO = new WorkshopResponseDTO();
        workshopResponseDTO.setId(1L);
        workshopResponseDTO.setTitle("Pottery Workshop");
        workshopResponseDTO.setDescription("Learn pottery basics");
        workshopResponseDTO.setDate(LocalDate.now().plusDays(7));
        workshopResponseDTO.setLevel(WorkshopLevel.BEGINNER);
        workshopResponseDTO.setSchedule(WorkshopSchedule.MORNING);
        workshopResponseDTO.setMaxParticipants(10);
        workshopResponseDTO.setAvailablePlaces(10);
        workshopResponseDTO.setPrice(50.0);
        workshopResponseDTO.setInstructorId(1L);
        workshopResponseDTO.setImageUrl("http://example.com/images/workshop1.jpg");

        mockImage = new MockMultipartFile(
                "image",
                "test-image.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        pageable = PageRequest.of(0, 10);
    }

    private void setupSecurityContext() {
        when(userDetails.getUsername()).thenReturn("instructor@example.com");
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
    }

    @Test
    void createWorkshop_Success() throws IOException {
        workshopRequestDTO.setImage(mockImage);
        setupSecurityContext();

        when(userRepository.findByEmail("instructor@example.com")).thenReturn(Optional.of(instructor));
        when(workshopMapper.toEntity(workshopRequestDTO)).thenReturn(workshop);
        when(imageStorageService.saveWorkshopImage(mockImage)).thenReturn("saved-image.jpg");
        when(workshopRepository.save(any(Workshop.class))).thenReturn(workshop);
        when(workshopMapper.toDTO(workshop)).thenReturn(workshopResponseDTO);

        // Act
        WorkshopResponseDTO result = workshopService.createWorkshop(workshopRequestDTO);

        // Assert
        assertNotNull(result);
        assertEquals(workshopResponseDTO.getId(), result.getId());
        verify(userRepository).findByEmail("instructor@example.com");
        verify(workshopMapper).toEntity(workshopRequestDTO);
        verify(imageStorageService).saveWorkshopImage(mockImage);
        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDTO(workshop);
    }

    @Test
    void createWorkshop_UserNotFound() {
        // Arrange
        String expectedEmail = "instructor@example.com";

        when(userDetails.getUsername()).thenReturn(expectedEmail);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(userRepository.findByEmail(expectedEmail)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> workshopService.createWorkshop(workshopRequestDTO));

        // Verify
        verify(userRepository).findByEmail(expectedEmail);
        verify(workshopRepository, never()).save(any(Workshop.class));

        verify(securityContext).getAuthentication();
        verify(authentication).getPrincipal();
        verify(userDetails).getUsername();
    }

    @Test
    void updateWorkshop_Success() throws IOException {
        // Arrange
        Long workshopId = 1L;

        workshopRequestDTO.setTitle("Updated Workshop Title");
        workshopRequestDTO.setDescription("Updated description");
        workshopRequestDTO.setLevel(WorkshopLevel.INTERMEDIATE);
        workshopRequestDTO.setSchedule(WorkshopSchedule.AFTERNOON);
        workshopRequestDTO.setMaxParticipants(15);
        workshopRequestDTO.setPrice(75.0);
        workshopRequestDTO.setImage(mockImage);

        Workshop existingWorkshop = workshop;
        String oldImageFileName = "workshop1.jpg";
        existingWorkshop.setImageFileName(oldImageFileName);

        WorkshopResponseDTO updatedResponseDTO = new WorkshopResponseDTO();
        updatedResponseDTO.setId(workshopId);
        updatedResponseDTO.setTitle("Updated Workshop Title");
        updatedResponseDTO.setDescription("Updated description");
        updatedResponseDTO.setDate(LocalDate.now().plusDays(7));
        updatedResponseDTO.setLevel(WorkshopLevel.INTERMEDIATE);
        updatedResponseDTO.setSchedule(WorkshopSchedule.AFTERNOON);
        updatedResponseDTO.setMaxParticipants(15);
        updatedResponseDTO.setAvailablePlaces(15);
        updatedResponseDTO.setPrice(75.0);
        updatedResponseDTO.setInstructorId(1L);
        updatedResponseDTO.setImageUrl("http://example.com/images/new-image.jpg");

        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(existingWorkshop));

        when(userDetails.getUsername()).thenReturn("instructor@example.com");

        String newImageFileName = "new-image.jpg";
        when(imageStorageService.saveWorkshopImage(mockImage)).thenReturn(newImageFileName);

        doNothing().when(workshopMapper).updateEntityFromDTO(workshopRequestDTO, existingWorkshop);

        when(workshopRepository.save(existingWorkshop)).thenReturn(existingWorkshop);

        when(workshopMapper.toDTO(existingWorkshop)).thenReturn(updatedResponseDTO);

        // Act
        WorkshopResponseDTO result = workshopService.updateWorkshop(workshopId, workshopRequestDTO, userDetails);

        // Assert
        assertNotNull(result);
        assertEquals(updatedResponseDTO.getId(), result.getId());
        assertEquals(updatedResponseDTO.getTitle(), result.getTitle());
        assertEquals(updatedResponseDTO.getLevel(), result.getLevel());
        assertEquals(updatedResponseDTO.getSchedule(), result.getSchedule());
        assertEquals(updatedResponseDTO.getMaxParticipants(), result.getMaxParticipants());
        assertEquals(updatedResponseDTO.getPrice(), result.getPrice());
        assertEquals(updatedResponseDTO.getImageUrl(), result.getImageUrl());

        // Verify
        verify(workshopRepository).findById(workshopId);
        verify(workshopMapper).updateEntityFromDTO(workshopRequestDTO, existingWorkshop);
        verify(imageStorageService).saveWorkshopImage(mockImage);
        verify(imageStorageService).deleteWorkshopImage(oldImageFileName);
        verify(workshopRepository).save(existingWorkshop);
        verify(workshopMapper).toDTO(existingWorkshop);
    }


    @Test
    void updateWorkshop_Unauthorized() {
        // Arrange
        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(userDetails.getUsername()).thenReturn("another@example.com");

        // Act & Assert
        assertThrows(AccessDeniedException.class, () ->
                workshopService.updateWorkshop(1L, workshopRequestDTO, userDetails));

        verify(workshopRepository).findById(1L);
        verify(workshopRepository, never()).save(any(Workshop.class));
    }

    @Test
    void getAllWorkshops_Success() {
        // Arrange
        List<Workshop> workshops = Collections.singletonList(workshop);
        Page<Workshop> workshopPage = new PageImpl<>(workshops, pageable, workshops.size());

        when(workshopRepository.findAll(pageable)).thenReturn(workshopPage);
        when(workshopMapper.toDTO(workshop)).thenReturn(workshopResponseDTO);

        // Act
        Page<WorkshopResponseDTO> result = workshopService.getAllWorkshops(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(workshopResponseDTO, result.getContent().get(0));
        verify(workshopRepository).findAll(pageable);
        verify(workshopMapper).toDTO(workshop);
        verifyNoInteractions(userDetails, securityContext, authentication);
    }

    @Test
    void getWorkshopById_Success() {
        // Arrange
        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(workshopMapper.toDTO(workshop)).thenReturn(workshopResponseDTO);

        // Act
        WorkshopResponseDTO result = workshopService.getWorkshopById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(workshopRepository).findById(1L);
        verify(workshopMapper).toDTO(workshop);
        verifyNoInteractions(userDetails, securityContext, authentication);
    }

    @Test
    void getWorkshopById_NotFound() {
        // Arrange
        when(workshopRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(WorkshopException.class, () -> workshopService.getWorkshopById(1L));
        verify(workshopRepository).findById(1L);
        verifyNoMoreInteractions(workshopRepository);
        verifyNoInteractions(workshopMapper);
    }

    @Test
    void getUpcomingWorkshops_Success() {
        // Arrange
        List<Workshop> workshops = Collections.singletonList(workshop);
        Page<Workshop> workshopPage = new PageImpl<>(workshops, pageable, workshops.size());

        when(workshopRepository.findByDateGreaterThanEqual(any(LocalDate.class), eq(pageable)))
                .thenReturn(workshopPage);
        when(workshopMapper.toDTO(workshop)).thenReturn(workshopResponseDTO);

        // Act
        Page<WorkshopResponseDTO> result = workshopService.getUpcomingWorkshops(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(workshopResponseDTO, result.getContent().get(0));
        verify(workshopRepository).findByDateGreaterThanEqual(any(LocalDate.class), eq(pageable));
        verify(workshopMapper).toDTO(workshop);
    }

    @Test
    void deleteWorkshop_Success() throws IOException {
        // Arrange
        workshop.getInstructor().setEmail("instructor@example.com");

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(userDetails.getUsername()).thenReturn("instructor@example.com");
        
        workshop.setReservations(new HashSet<>());

        // Act
        workshopService.deleteWorkshop(1L, userDetails);

        // Assert
        verify(workshopRepository).findById(1L);
        verify(imageStorageService).deleteWorkshopImage("workshop1.jpg");
        verify(workshopRepository).delete(workshop);
    }

    @Test
    void deleteWorkshop_Unauthorized() {
        // Arrange
        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(userDetails.getUsername()).thenReturn("another@example.com");

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> workshopService.deleteWorkshop(1L, userDetails));
        verify(workshopRepository).findById(1L);
        verify(workshopRepository, never()).delete(any(Workshop.class));
    }


    @Test
    void getWorkshopsByInstructorId_Success() {
        // Arrange
        List<Workshop> workshops = Collections.singletonList(workshop);
        Page<Workshop> workshopPage = new PageImpl<>(workshops, pageable, workshops.size());

        when(workshopRepository.findByInstructorId(1L, pageable)).thenReturn(workshopPage);
        when(workshopMapper.toDTO(workshop)).thenReturn(workshopResponseDTO);

        // Act
        Page<WorkshopResponseDTO> result = workshopService.getWorkshopsByInstructorId(1L, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(workshopResponseDTO, result.getContent().get(0));
        verify(workshopRepository).findByInstructorId(1L, pageable);
        verify(workshopMapper).toDTO(workshop);
    }

}
