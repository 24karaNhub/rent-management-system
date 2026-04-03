package com.karan.rentmangement.DTO.RequestDTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}