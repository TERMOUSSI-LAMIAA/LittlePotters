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


    @Override
    public UserResponseDTO save(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
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

        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }


    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(id));
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
