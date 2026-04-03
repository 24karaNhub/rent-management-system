package com.karan.rentmangement.service;

import com.karan.rentmangement.DTO.RequestDTO.SignupRequestDTO;
import org.springframework.stereotype.Service;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.DTO.RequestDTO.LoginRequest;

@Service
public class AuthService {

    private final LandlordRepo landlordRepo;

    public AuthService(LandlordRepo landlordRepo) {
        this.landlordRepo = landlordRepo;
    }

    public Landlord login(LoginRequest request) {

        Landlord landlord = landlordRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!landlord.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return landlord;
    }public Landlord signup(SignupRequestDTO dto) {

        // 🔥 check if user already exists
        landlordRepo.findByEmail(dto.getEmail())
                .ifPresent(l -> {
                    throw new RuntimeException("Email already registered");
                });

        Landlord landlord = new Landlord();
        landlord.setName(dto.getName());
        landlord.setEmail(dto.getEmail());
        landlord.setPhone(dto.getPhone());
        landlord.setPassword(dto.getPassword()); // later we encrypt

        return landlordRepo.save(landlord);
    }

    public Landlord signup(Landlord landlord) {
        return landlordRepo.save(landlord);
    }
}
