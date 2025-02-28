package com.littlepotters.littlepotters.config;

import com.littlepotters.littlepotters.dtos.requestDTOs.UserRequestDTO;
import com.littlepotters.littlepotters.models.entities.Role;
import com.littlepotters.littlepotters.repositories.RoleRepository;
import com.littlepotters.littlepotters.services.inter.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.role}")
    private String adminRole;

    @Value("${admin.fullname}")
    private String adminFullname;

    @Value("${admin.phone}")
    private String adminPhone;

    @Override
    public void run(String... args) throws Exception {
        if (!userService.existsByEmail(adminEmail)) {
            Role adminRoleEntity = roleRepository.findByName(adminRole).orElse(null);
            if (adminRoleEntity == null) {
                Role newRole = new Role();
                newRole.setName(adminRole);
                adminRoleEntity = roleRepository.save(newRole);
            }

            UserRequestDTO admin = new UserRequestDTO();
            admin.setEmail(adminEmail);
            admin.setPassword(adminPassword);
            admin.setFullname(adminFullname);
            admin.setPhone(adminPhone);
            admin.setActive(true);
            admin.setRoles(Collections.singleton(adminRoleEntity.getName()));

            try {
                userService.save(admin);
            } catch (Exception e) {
                System.err.println("Error during administrator creation : " + e.getMessage());
            }
        }
    }

}
