package com.karan.rentmangement.controller;

import org.springframework.web.bind.annotation.*;
import com.karan.rentmangement.service.AuthService;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.DTO.RequestDTO.LoginRequest;
import com.karan.rentmangement.DTO.RequestDTO.SignupRequestDTO;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Landlord login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public Landlord signup(@RequestBody SignupRequestDTO dto) {
        return authService.signup(dto);
    }
}
