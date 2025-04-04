package com.littlepotters.littlepotters.controllers;


import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.repositories.RoleRepository;
import com.littlepotters.littlepotters.services.inter.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("api/admin/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;
//TODO: can't delete instructor who has recent workshops
    //TODO: the phone number should be unique
    @PostMapping(value="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> registerUser(@ModelAttribute @Valid UserRequestDTO userRequestDTO) {

        UserResponseDTO userResponseDTO = userService.save(userRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDTO);
    }

    @PutMapping(value="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
               @ModelAttribute @Valid UserRequestDTO userRequestDTO) {

        UserResponseDTO updatedUser = userService.updateUser(id, userRequestDTO);

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User with ID " + id + " has been deleted successfully.");
    }

    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(
            @RequestParam(name = "role", required = false) String role,
            Pageable pageable) {
        if (role != null) {
            Page<UserResponseDTO> filteredUsers = userService.getUsersByRole(role, pageable);
            return ResponseEntity.ok(filteredUsers);
        }

        Page<UserResponseDTO> allUsers = userService.getAllUsers(pageable);
        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("profile-images").resolve(fileName);
            System.out.println(" Searching for profile image at: " + filePath.toAbsolutePath());

            if (!Files.exists(filePath)) {
                System.out.println(" Profile image not found at: " + filePath.toAbsolutePath());
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found");
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(imageBytes);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading profile image", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

}
