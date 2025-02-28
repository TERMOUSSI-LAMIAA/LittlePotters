package com.littlepotters.littlepotters.controllers;


import com.littlepotters.littlepotters.dtos.requestDTOs.AuthRequestDTO;
import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.AuthResponseDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.RoleResponseDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.security.JwtTokenProvider;
import com.littlepotters.littlepotters.services.inter.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;


    @PostMapping("/login")
    public String login(@RequestBody AuthRequestDTO authRequestDTO) {
        try {
            System.out.println("Attempting login for: " + authRequestDTO.getEmail());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword()));
            System.out.println("Authentication successful");
            return jwtTokenProvider.generateToken(authentication.getName(), authentication.getAuthorities().toString());
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            throw e;
        }
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody @Validated UserRequestDTO userRequestDTO) {

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

}
