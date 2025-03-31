package com.littlepotters.littlepotters.controllers;


import com.littlepotters.littlepotters.dtos.requestDTOs.AuthRequestDTO;
import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.AuthResponseDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.RoleResponseDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.mappers.UserMapper;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.repositories.UserRepository;
import com.littlepotters.littlepotters.security.JwtTokenProvider;
import com.littlepotters.littlepotters.services.inter.UserService;
import com.littlepotters.littlepotters.services.security.TokenBlacklistService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequestDTO authRequestDTO) {
        try {
            System.out.println("Attempting login for: " + authRequestDTO.getEmail());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword()));
            System.out.println("Authentication successful");
            String token = jwtTokenProvider.generateToken(authentication.getName(), authentication.getAuthorities().toString());
            List<String> roles = authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + authentication.getName()));
            UserResponseDTO userResponseDTO = userMapper.toDTO(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("roles", roles);
            response.put("user", userResponseDTO);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            throw e;
        }
    }

    @PostMapping(value="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponseDTO> register(@ModelAttribute @Valid UserRequestDTO userRequestDTO) {

        UserResponseDTO userResponseDTO = userService.save(userRequestDTO);

        String token = jwtTokenProvider.generateToken(userRequestDTO.getEmail(),
                userResponseDTO.getRoles().stream()
                        .map(RoleResponseDTO::getName)
                        .collect(Collectors.joining(","))
        );

        AuthResponseDTO authResponse = new AuthResponseDTO(
                userResponseDTO.getId(),
                userResponseDTO.getEmail(),
                userResponseDTO.getRoles().stream()
                        .map(RoleResponseDTO::getName)
                        .collect(Collectors.toList()),
                token
        );

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("Logout successful. Token is now invalid.");
    }

}
