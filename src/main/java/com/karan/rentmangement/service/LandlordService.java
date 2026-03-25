package com.karan.rentmangement.service;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.karan.rentmangement.DTO.RequestDTO.LandlordRequestDTO;
import com.karan.rentmangement.DTO.ResponeDTO.LandlordResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.repository.LandlordRepo;

@Service
public class LandlordService {
    private final LandlordRepo landlordRepo;
    public LandlordService(LandlordRepo landlordRepo){
        this.landlordRepo=landlordRepo;
    }
    private Landlord toEntity(LandlordRequestDTO dto){
            Landlord landlord = new Landlord();
            landlord.setName(dto.getName());
            landlord.setEmail(dto.getEmail());
            landlord.setPhone(dto.getPhone());
            return landlord;
    }
    private LandlordResponseDTO tResponseDTO(Landlord landlord){
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        return dto;
    }
    
    public LandlordResponseDTO createLandlord( LandlordRequestDTO dto) {
        Landlord landlord = toEntity(dto);
        Landlord saved  = landlordRepo.save(landlord);
        return tResponseDTO(saved);


    }
    public List<LandlordResponseDTO> getallLandlords() {
        return landlordRepo.findAll()
                .stream()
                .map(this::tResponseDTO)
                .collect(Collectors.toList());
    }
    public LandlordResponseDTO getById( int id) {
        Landlord landlord = landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        return tResponseDTO(landlord);

    
            }
     public LandlordResponseDTO updateLandlord( int id,  LandlordRequestDTO dto) {
        Landlord existing = landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("not found"));
        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        return tResponseDTO(landlordRepo.save(existing));


    }
}
