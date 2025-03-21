package com.littlepotters.littlepotters.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.services.inter.WorkshopService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/instructor/workshops")
@AllArgsConstructor
public class WorkshopController {
    //TODO: admin can access this endpoints but with an instructor credentials
    private final WorkshopService workshopService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WorkshopResponseDTO> createWorkshop(
            @Valid @ModelAttribute WorkshopRequestDTO workshopRequestDTO) throws IOException {
        WorkshopResponseDTO createdWorkshop = workshopService.createWorkshop(workshopRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkshop);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WorkshopResponseDTO> updateWorkshop(
            @PathVariable Long id,
            @Valid @ModelAttribute WorkshopRequestDTO workshopRequestDTO,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        WorkshopResponseDTO updatedWorkshop = workshopService.updateWorkshop(id, workshopRequestDTO,userDetails);
        return ResponseEntity.ok(updatedWorkshop);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponseDTO> getWorkshopById(@PathVariable Long id) {
        return ResponseEntity.ok(workshopService.getWorkshopById(id));
    }

    @GetMapping
    public ResponseEntity<Page<WorkshopResponseDTO>> getAllWorkshops(Pageable pageable, Long userId) {
        Page<WorkshopResponseDTO> workshopsPage ;
        if (userId != null) {
            workshopsPage  = workshopService.getWorkshopsByInstructorId(userId, pageable);
        }else{
            workshopsPage  = workshopService.getAllWorkshops(pageable);
        }

        return ResponseEntity.ok(workshopsPage);
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("workshop-images").resolve(fileName);
            System.out.println(" Searching for image at: " + filePath.toAbsolutePath());

            if (!Files.exists(filePath)) {
                System.out.println(" Image not found at: " + filePath.toAbsolutePath());
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(imageBytes);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading image", e);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        workshopService.deleteWorkshop(id,userDetails);
        return ResponseEntity.noContent().build();
    }
}
