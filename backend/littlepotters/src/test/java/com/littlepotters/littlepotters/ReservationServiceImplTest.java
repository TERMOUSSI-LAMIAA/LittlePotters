package com.littlepotters.littlepotters;

import com.littlepotters.littlepotters.dtos.requestDTOs.ReservationRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.ReservationResponseDTO;
import com.littlepotters.littlepotters.exceptions.ReservationException;
import com.littlepotters.littlepotters.mappers.ReservationMapper;
import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.littlepotters.littlepotters.repositories.ReservationRepository;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.repositories.WorkshopRepository;
import com.littlepotters.littlepotters.services.impl.ReservationServiceImpl;
import com.littlepotters.littlepotters.services.inter.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceImplTest {
    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private WorkshopRepository workshopRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReservationMapper reservationMapper;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    private User mockUser;
    private Workshop mockWorkshop;
    private Reservation mockReservation;
    private ReservationRequestDTO mockRequestDTO;
    private ReservationResponseDTO mockResponseDTO;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setFullname("Test User");

        mockWorkshop = new Workshop();
        mockWorkshop.setId(1L);
        mockWorkshop.setAvailablePlaces(10);
        mockWorkshop.setPrice(100.0);
        mockWorkshop.setMaxParticipants(15);

        mockReservation = new Reservation();
        mockReservation.setId(1L);
        mockReservation.setCustomer(mockUser);
        mockReservation.setWorkshop(mockWorkshop);
        mockReservation.setPlacesBooked(2);
        mockReservation.setStatus(ReservationStatus.PENDING);
        mockReservation.setTotalPrice(200.0);

        mockRequestDTO = new ReservationRequestDTO();
        mockRequestDTO.setWorkshopId(1L);
        mockRequestDTO.setPlacesBooked(2);

        mockResponseDTO = new ReservationResponseDTO();
        mockResponseDTO.setId(1L);
        mockResponseDTO.setCustomerId(1L);
        mockResponseDTO.setWorkshopId(1L);
        mockResponseDTO.setPlacesBooked(2);
        mockResponseDTO.setTotalPrice(200.0);
        mockResponseDTO.setStatus("PENDING");
    }

    private void setupSecurityContext() {
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testCreateReservation_Success() {
        setupSecurityContext();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(workshopRepository.findById(1L)).thenReturn(Optional.of(mockWorkshop));
        when(reservationRepository.existsByCustomerAndWorkshop(mockUser, mockWorkshop)).thenReturn(false);
        when(reservationMapper.toEntity(mockRequestDTO)).thenReturn(mockReservation);
        when(reservationRepository.save(mockReservation)).thenReturn(mockReservation);
        when(reservationMapper.toDTO(mockReservation)).thenReturn(mockResponseDTO);

        ReservationResponseDTO result = reservationService.createReservation(mockRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(8, mockWorkshop.getAvailablePlaces());
        verify(workshopRepository).save(mockWorkshop);
    }

    @Test
    void testCreateReservation_UserNotFound() {
        setupSecurityContext();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class,
                () -> reservationService.createReservation(mockRequestDTO));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testGetAllReservations_Success() {
        List<Reservation> reservations = Collections.singletonList(mockReservation);

        when(reservationRepository.findAll()).thenReturn(reservations);

        when(reservationMapper.toDTO(mockReservation)).thenReturn(mockResponseDTO);

        List<ReservationResponseDTO> result = reservationService.getAllReservations();

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockResponseDTO, result.get(0));

        // Verifications
        verify(reservationRepository).findAll();
        verify(reservationMapper).toDTO(mockReservation);
    }

    @Test
    public void testGetReservationById_Success() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(mockReservation));

        when(reservationMapper.toDTO(mockReservation)).thenReturn(mockResponseDTO);

        ReservationResponseDTO result = reservationService.getReservationById(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(Long.valueOf(1L), result.getId());

        // Verify
        verify(reservationRepository).findById(1L);
        verify(reservationMapper).toDTO(mockReservation);
    }

    @Test
    void testDeleteReservation_Success() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(authentication.getName()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(mockReservation));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        reservationService.deleteReservation(1L);

        // Verify
        assertEquals(12, mockWorkshop.getAvailablePlaces());
        verify(workshopRepository).save(mockWorkshop);
        verify(reservationRepository).delete(mockReservation);
    }

    @Test
    void testDeleteReservation_ReservationNotFound() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ReservationException.class, () ->
                reservationService.deleteReservation(1L));
    }



}
