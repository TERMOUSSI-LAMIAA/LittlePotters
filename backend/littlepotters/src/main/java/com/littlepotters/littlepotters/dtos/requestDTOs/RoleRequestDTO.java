package com.littlepotters.littlepotters.dtos.requestDTOs;


import lombok.*;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleRequestDTO {

    @NotBlank(message = "Role name cannot be empty")
    private String name;
}
