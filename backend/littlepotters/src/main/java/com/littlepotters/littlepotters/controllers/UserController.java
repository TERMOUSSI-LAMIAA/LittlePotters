package com.littlepotters.littlepotters.controllers;


import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.dtos.responseDTOs.UserResponseDTO;
import com.littlepotters.littlepotters.repositories.RoleRepository;
import com.littlepotters.littlepotters.services.inter.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/admin/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;
//TODO: can't delete instructor who has recent workshops
    //TODO: email cannot be updated
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody @Valid UserRequestDTO userRequestDTO) {

        UserResponseDTO userResponseDTO = userService.save(userRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserRequestDTO userRequestDTO) {

        UserResponseDTO updatedUser = userService.updateUser(id, userRequestDTO);

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User with ID " + id + " has been deleted successfully.");
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
