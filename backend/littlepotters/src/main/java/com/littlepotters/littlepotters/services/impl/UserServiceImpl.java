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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

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

        Set<Role> roles = new HashSet<>();
        for (String roleName : userRequestDTO.getRoles()) {
            Role role = roleRepository.findByName(roleName);
            if (role != null) {
                roles.add(role);
            } else {
                throw new RoleException(roleName);
            }
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }


    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserException(id));

        userMapper.updateEntityFromDTO(userRequestDTO, existingUser);
        if (userRequestDTO.getRoles() != null) {
            Set<Role> roles = userRequestDTO.getRoles().stream()
                    .map(roleName -> {
                        Role role = roleRepository.findByName(roleName);
                        if (role == null) {
                            throw new RoleException(roleName);
                        }
                        return role;
                    })
                    .collect(Collectors.toSet());
            existingUser.setRoles(roles);
        }
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }
        User updatedUser = userRepository.save(existingUser);

        return userMapper.toDTO(updatedUser);
    }


    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(id));
        userRepository.delete(user);
    }


    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(id));
        return userMapper.toDTO(user);
    }
}
