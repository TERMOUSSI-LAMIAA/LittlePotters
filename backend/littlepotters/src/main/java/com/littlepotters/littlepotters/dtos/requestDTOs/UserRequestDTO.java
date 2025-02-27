package com.littlepotters.littlepotters.dtos.requestDTOs;

import lombok.*;

import javax.validation.constraints.*;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotBlank(message = "Full name cannot be blank")
    private String fullname;

    @NotBlank(message = "Phone number cannot be blank")
    private String phone;

    @NotNull(message = "Active status cannot be null")
    private Boolean active;

    @NotNull(message = "Roles cannot be null")
    private Set<String> roles;
}
