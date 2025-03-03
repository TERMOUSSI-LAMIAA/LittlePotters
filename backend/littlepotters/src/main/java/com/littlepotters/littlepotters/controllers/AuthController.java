package com.littlepotters.littlepotters.controllers;


import com.littlepotters.littlepotters.dtos.requestDTOs.AuthRequestDTO;
import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.AuthResponseDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.RoleResponseDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.security.JwtTokenProvider;
import com.littlepotters.littlepotters.services.inter.UserService;
import com.littlepotters.littlepotters.services.security.TokenBlacklistService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;
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

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("Logout successful. Token is now invalid.");
    }

}
