package com.littlepotters.littlepotters.dtos.requestDTOs;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AuthRequestDTO {
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "password is required")
    private String password;
}
