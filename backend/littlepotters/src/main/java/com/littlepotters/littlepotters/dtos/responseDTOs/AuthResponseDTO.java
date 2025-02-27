package com.littlepotters.littlepotters.dtos.responseDTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {

    private Long id;
    private String login;
    private List<String> roles;
    private String token;
}
