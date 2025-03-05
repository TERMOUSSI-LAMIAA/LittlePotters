package com.littlepotters.littlepotters.controllers;

import com.littlepotters.littlepotters.dtos.requestDTOs.WorkshopRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.WorkshopResponseDTO;
import com.littlepotters.littlepotters.services.inter.WorkshopService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/instructor/workshops")
@AllArgsConstructor
public class WorkshopController {
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
            @Valid @ModelAttribute WorkshopRequestDTO workshopRequestDTO) throws IOException {
        WorkshopResponseDTO updatedWorkshop = workshopService.updateWorkshop(id, workshopRequestDTO);
        return ResponseEntity.ok(updatedWorkshop);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponseDTO> getWorkshopById(@PathVariable Long id) {
        return ResponseEntity.ok(workshopService.getWorkshopById(id));
    }

    @GetMapping
    public ResponseEntity<List<WorkshopResponseDTO>> getAllWorkshops() {
        return ResponseEntity.ok(workshopService.getAllWorkshops());
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable Long id) {
        workshopService.deleteWorkshop(id);
        return ResponseEntity.noContent().build();
    }
}
