package com.littlepotters.littlepotters.services.inter;

import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface UserService {

    UserResponseDTO save(UserRequestDTO userRequestDTO);

    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);

    void deleteUser(Long id);
    boolean existsByEmail(String email);



    UserResponseDTO getUserById(Long id);
    Page<UserResponseDTO> getUsersByRole(String roleName, Pageable pageable);
    Page<UserResponseDTO> getAllUsers(Pageable pageable);}
