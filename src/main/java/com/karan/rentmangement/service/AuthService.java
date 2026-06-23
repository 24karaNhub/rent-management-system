package com.karan.rentmangement.service;

import com.karan.rentmangement.DTO.RequestDTO.SignupRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import com.karan.rentmangement.security.Jwtservice;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.DTO.RequestDTO.LoginRequest;

@Service
public class AuthService {

    private final LandlordRepo landlordRepo;
    private final PasswordEncoder passwordEncoder;
    private final Jwtservice jwtService;

    public AuthService(LandlordRepo landlordRepo, PasswordEncoder passwordEncoder, Jwtservice jwtService) {
        this.landlordRepo = landlordRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LandlordResponseDTO login(LoginRequest request) {
        Landlord landlord = landlordRepo.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), landlord.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        LandlordResponseDTO dto = toResponseDTO(landlord);
        dto.setToken(jwtService.generateToken(landlord.getEmail()));
        return dto;
    }

    private LandlordResponseDTO toResponseDTO(Landlord landlord) {
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        // Add other fields as needed
        return dto;
    }

    public LandlordResponseDTO signup(SignupRequestDTO dto) {

        // 🔥 check if user already exists
        landlordRepo.findByEmail(dto.getEmail())
                .ifPresent(l -> {
                    throw new RuntimeException("Email already registered");
                });

        Landlord landlord = new Landlord();
        landlord.setName(dto.getName());
        landlord.setEmail(dto.getEmail());
        landlord.setPhone(dto.getPhone());
        landlord.setPassword(passwordEncoder.encode(dto.getPassword())); // BCrypt encrypt

        landlord = landlordRepo.save(landlord);
        LandlordResponseDTO responseDto = toResponseDTO(landlord);
        responseDto.setToken(jwtService.generateToken(landlord.getEmail()));
        return responseDto;
    }

    public Landlord signup(Landlord landlord) {
        landlord.setPassword(passwordEncoder.encode(landlord.getPassword())); // BCrypt encrypt
        return landlordRepo.save(landlord);
    }
}
