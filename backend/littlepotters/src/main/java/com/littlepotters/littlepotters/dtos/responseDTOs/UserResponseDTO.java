package com.littlepotters.littlepotters.dtos.responseDTOs;


import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String email;
    private String fullname;
    private String phone;
    private Boolean active;
    private Set<RoleResponseDTO> roles;
}
