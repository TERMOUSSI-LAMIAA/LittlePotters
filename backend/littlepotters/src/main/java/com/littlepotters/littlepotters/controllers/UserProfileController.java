package com.littlepotters.littlepotters.controllers;

import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.services.inter.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("api/users")
@AllArgsConstructor
public class UserProfileController {
    private final UserService userService;



//    @GetMapping("/images/{fileName}")
//    public ResponseEntity<byte[]> getProfileImage(@PathVariable String fileName) {
//        try {
//            Path filePath = Paths.get("profile-images").resolve(fileName);
//            System.out.println(" Searching for profile image at: " + filePath.toAbsolutePath());
//
//            if (!Files.exists(filePath)) {
//                System.out.println(" Profile image not found at: " + filePath.toAbsolutePath());
//                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found");
//            }
//
//            byte[] imageBytes = Files.readAllBytes(filePath);
//            String contentType = Files.probeContentType(filePath);
//
//            return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
//                    .body(imageBytes);
//        } catch (IOException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading profile image", e);
//        }
//    }
}
