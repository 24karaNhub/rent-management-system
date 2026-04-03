package com.karan.rentmangement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import org.springframework.stereotype.Service;

import com.karan.rentmangement.DTO.RequestDTO.LandlordRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.repository.rentPaymentRepo;
import com.karan.rentmangement.model.rentPayment;

@Service
public class LandlordService {

    private final LandlordRepo landlordRepo;
    private final PropertyRepo propertyRepo;
    private final TenantRepo tenantRepo;
    private final rentPaymentRepo rentPaymentRepository;

    // ✅ Constructor Injection (Correct Way)
    public LandlordService(LandlordRepo landlordRepo,
                           PropertyRepo propertyRepo,
                           TenantRepo tenantRepo,
                           rentPaymentRepo rentPaymentRepository) {
        this.landlordRepo = landlordRepo;
        this.propertyRepo = propertyRepo;
        this.tenantRepo = tenantRepo;
        this.rentPaymentRepository = rentPaymentRepository;
    }

    // 🔁 Convert RequestDTO → Entity
    private Landlord toEntity(LandlordRequestDTO dto) {
        Landlord landlord = new Landlord();
        landlord.setName(dto.getName());
        landlord.setEmail(dto.getEmail());
        landlord.setPhone(dto.getPhone());
        return landlord;
    }

    // 🔁 Convert Entity → ResponseDTO
    private LandlordResponseDTO toResponseDTO(Landlord landlord) {
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        return dto;
    }

    // ➕ Create
    public LandlordResponseDTO createLandlord(LandlordRequestDTO dto) {
        Landlord landlord = toEntity(dto);
        Landlord saved = landlordRepo.save(landlord);
        return toResponseDTO(saved);
    }

    // 📄 Get All
    public List<LandlordResponseDTO> getAllLandlords() {
        return landlordRepo.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // 🔍 Get By ID
    public LandlordResponseDTO getById(int id) {
        Landlord landlord = landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        return toResponseDTO(landlord);
    }

    // ✏️ Update
    public LandlordResponseDTO updateLandlord(int id, LandlordRequestDTO dto) {
        Landlord existing = landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());

        return toResponseDTO(landlordRepo.save(existing));
    }

    // ❌ Delete
    
    @Transactional
public LandlordResponseDTO deleteLandlord(int id) {
    Landlord existing = landlordRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Landlord not found"));

    // ✅ Direct queries — bypass Bean Validation entirely
    tenantRepo.unlinkLandlord(id);
    propertyRepo.unlinkLandlord(id);
    rentPaymentRepository.unlinkLandlord(id);

    landlordRepo.delete(existing);
    return toResponseDTO(existing);
}
}