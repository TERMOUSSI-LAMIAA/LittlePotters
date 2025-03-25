package com.littlepotters.littlepotters.services.impl;

import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.exceptions.RoleException;
import com.littlepotters.littlepotters.exceptions.UserException;
import com.littlepotters.littlepotters.mappers.UserMapper;
import com.littlepotters.littlepotters.models.entities.Role;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.repositories.RoleRepository;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.services.inter.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;//final

    private RoleRepository roleRepository;

    private UserMapper userMapper;

    private PasswordEncoder passwordEncoder;
    private final ImageStorageService imageStorageService;

    @Override
    public UserResponseDTO save(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRequestDTO.getPassword() == null || userRequestDTO.getPassword().isEmpty()) {
            throw new RuntimeException("Password cannot be blank");
        }
        User user = userMapper.toEntity(userRequestDTO);
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        List<Role> roles = userRequestDTO.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName)))
                .collect(Collectors.toList());

        if (roles.isEmpty()) {
            Role defaultRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new IllegalArgumentException("Default 'USER' role not found"));
            roles.add(defaultRole);
        }

        user.setRoles(new HashSet<>(roles));
        if (userRequestDTO.getImage() != null && !userRequestDTO.getImage().isEmpty()) {
            try {
                String fileName = imageStorageService.saveProfileImage(userRequestDTO.getImage());
                user.setImageFileName(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Error saving profile image", e);
            }
        }
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
    @Override
    public Page<UserResponseDTO> getUsersByRole(String roleName, Pageable pageable) {
        if (!roleRepository.existsByName(roleName)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid role specified: " + roleName
            );
        }
        Page<User> users = userRepository.findByRoles_Name(roleName, pageable);
        return users.map(userMapper::toDTO);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserException(id));
        String oldImageFileName = user.getImageFileName();
        userMapper.updateEntityFromDTO(userRequestDTO, user);

        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        if (userRequestDTO.getRoles() != null && !userRequestDTO.getRoles().isEmpty()) {
            List<Role> roles = userRequestDTO.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName)))
                    .collect(Collectors.toList());
            user.setRoles(new HashSet<>(roles));
        }

        if (userRequestDTO.getImage() != null && !userRequestDTO.getImage().isEmpty()) {
            try {
                String newFileName = imageStorageService.saveProfileImage(userRequestDTO.getImage());
                user.setImageFileName(newFileName);

                if (oldImageFileName != null && !oldImageFileName.isEmpty()) {
                    try {
                        imageStorageService.deleteProfileImage(oldImageFileName);
                    } catch (IOException e) {
                        System.err.println("Warning: Could not delete old profile image: " + oldImageFileName + ". Error: " + e.getMessage());
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException("Error updating profile image", e);
            }
        }
        else if ("null".equals(userRequestDTO.getImageFileName())) {
            user.setImageFileName(null);

            if (oldImageFileName != null && !oldImageFileName.isEmpty()) {
                try {
                    imageStorageService.deleteProfileImage(oldImageFileName);
                } catch (IOException e) {
                    System.err.println("Warning: Could not delete old profile image: " + oldImageFileName + ". Error: " + e.getMessage());
                }
            }
        }
        else {
            user.setImageFileName(oldImageFileName);
        }
        User updatedUser = userRepository.save(user);

        return userMapper.toDTO(updatedUser);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));
        return userMapper.toDTO(user);
    }
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(id));

        String imageFileName = user.getImageFileName();
        if (imageFileName != null && !imageFileName.isEmpty()) {
            try {
                imageStorageService.deleteProfileImage(imageFileName);
            } catch (IOException e) {
                throw new RuntimeException("Error deleting profile image for user with id " + id, e);
            }
        }

        userRepository.delete(user);
    }


    @Override
    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(userMapper::toDTO);
    }


    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(id));
        return userMapper.toDTO(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
