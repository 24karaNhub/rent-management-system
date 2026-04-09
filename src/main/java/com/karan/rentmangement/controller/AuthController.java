package com.karan.rentmangement.controller;

import org.springframework.web.bind.annotation.*;
import com.karan.rentmangement.service.AuthService;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.DTO.RequestDTO.LoginRequest;
import com.karan.rentmangement.DTO.RequestDTO.SignupRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LandlordResponseDTO login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public LandlordResponseDTO signup(@RequestBody SignupRequestDTO dto) {
        return authService.signup(dto);
    }
}
