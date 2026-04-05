package com.karan.rentmangement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import org.springframework.stereotype.Service;

import com.karan.rentmangement.DTO.RequestDTO.TenantRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.TenantResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.repository.rentPaymentRepo;

@Service
public class TenantService {
    private final LandlordRepo landlordRepo;
    private final TenantRepo tenantRepo;
    private final PropertyRepo propertyRepo;
    private final rentPaymentRepo rentpaymentRepo;
    public TenantService(TenantRepo tenantRepo, LandlordRepo landlordRepo, PropertyRepo propertyRepo, rentPaymentRepo rentpaymentRepo){
        this.tenantRepo = tenantRepo;
        this.landlordRepo = landlordRepo;
        this.propertyRepo = propertyRepo;
        this.rentpaymentRepo=rentpaymentRepo;
    }
    private Tenant toEntity(TenantRequestDTO dto){
        Tenant tenant = new Tenant();
        tenant.setName(dto.getName());
    
        tenant.setEmail(dto.getEmail());
       tenant.setPhone(dto.getPhone());
       tenant.setRent(dto.getRent());
       Landlord landlord = landlordRepo
                .findById(dto.getLandlord_id())
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        tenant.setLandlord(landlord);         // ✅ set landlord

        Property property = propertyRepo
                .findById(dto.getProperty_id())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        tenant.setProperty(property);  
       return tenant;
    }
    private TenantResponseDTO tResponseDTO(Tenant tenant){
        TenantResponseDTO dto = new TenantResponseDTO();
        dto.setId(tenant.getid());
        dto.setName(tenant.getName());
        dto.setEmail(tenant.getEmail());
        dto.setPhone(tenant.getPhone());
        dto.setRent(tenant.getRent());    // ✅ add rent
    
    if (tenant.getLandlord() != null) {
        dto.setLandlordName(tenant.getLandlord().getName());
    }

    if (tenant.getProperty() != null) {
        dto.setPropertyAddress(tenant.getProperty().getAddress());
    }

        return dto;
    }
    

public RentPaymentResponseDTO toPaymentDTO(rentPayment payment){

    RentPaymentResponseDTO dto = new RentPaymentResponseDTO();

    dto.setId(payment.getId());
    
    if (payment.getRent() != null) {
        dto.setAmount(payment.getRent());
    }
    if (payment.getMonth() != null) {
        dto.setMonth(payment.getMonth().toString());
    }
    if (payment.getDate() != null) {
        dto.setDate(payment.getDate().toString());
    }
    
    dto.setStatus(payment.getStatus());

    return dto;
}
public LandlordResponseDTO toLandlordDTO(Landlord landlord){
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        return dto;
}





    public TenantResponseDTO createTenant(TenantRequestDTO dto) {

    // 1️⃣ Convert DTO → Entity (basic fields only)
    Tenant tenant = new Tenant();
    tenant.setName(dto.getName());
    tenant.setEmail(dto.getEmail());
    tenant.setPhone(dto.getPhone());
    tenant.setRent(dto.getRent());
    tenant.setMoveInDate(dto.getMoveInDate() != null ? LocalDate.parse(dto.getMoveInDate()) : null);
    tenant.setMoveOutDate(dto.getMoveOutDate() != null ? LocalDate.parse(dto.getMoveOutDate()) : null);

    // 2️⃣ Handle landlord relation
    Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
            .orElseThrow(() -> new RuntimeException("Landlord not found"));

    tenant.setLandlord(landlord);

    // 3️⃣ Handle property relation
    Property property = propertyRepo.findById(dto.getProperty_id())
            .orElseThrow(() -> new RuntimeException("Property not found"));

    tenant.setProperty(property);

    // 4️⃣ Save
    Tenant savedTenant = tenantRepo.save(tenant);

    // 5️⃣ Convert Entity → DTO (IMPORTANT 🔥)
    return tResponseDTO(savedTenant);
}
    public List<TenantResponseDTO> getAllTenants(){
        return tenantRepo.findAll()
                    .stream()
                    .map(this::tResponseDTO)
                    .collect(Collectors.toList());
    }
    public TenantResponseDTO getById( int  id){
        Tenant tenant=tenantRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Not Found"));
        return tResponseDTO(tenant);
    }
    /**
     * @param id
     * @param dto
     * @return
     */
    public TenantResponseDTO updateTenant(int id, TenantRequestDTO dto){

    // 1️⃣ Fetch existing tenant
    Tenant existing = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Tenant not found"));

    // 2️⃣ Update basic fields
    existing.setName(dto.getName());
    existing.setEmail(dto.getEmail());
    existing.setPhone(dto.getPhone());
    existing.setRent(dto.getRent());

    // 3️⃣ Handle landlord relation (IMPORTANT 🔥)
    Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
            .orElseThrow(() -> new RuntimeException("Landlord not found"));

    existing.setLandlord(landlord);

    // 4️⃣ Update property (using ID)
    Property property = propertyRepo.findById(dto.getProperty_id())
            .orElseThrow(() -> new RuntimeException("Property not found"));

    existing.setProperty(property);

    // 5️⃣ Save
    Tenant updated = tenantRepo.save(existing);

    // 6️⃣ Convert to DTO (IMPORTANT 🔥)
    return tResponseDTO(updated);
 }
    public String deleteTenant(int id){
    Tenant existing = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
    tenantRepo.delete(existing);
    return "Tenant deleted successfully";
}
public LandlordResponseDTO getTenantLandlord(int id){
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Landlord landlord = tenant.getLandlord();  // ✅ fix here

        if (landlord == null) {
            throw new RuntimeException("No landlord assigned to this tenant");
        }

        return toLandlordDTO(landlord);
    }
    public List<TenantResponseDTO> getTenantsByLandlord(int landlordId) {
        List<Tenant> tenants = tenantRepo.findByLandlordId(landlordId);

        return tenants.stream()
                .map(this::tResponseDTO)
                .toList();
    }
    public List<RentPaymentResponseDTO> getPaymentsOfTenant(int id){

    Tenant tenant = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Tenant not found"));

    // Problem 2 — make sure findByTenant returns List<rentPayment>
    List<rentPayment> payments = rentpaymentRepo.findByTenant(tenant);

    return payments
            .stream()
            .map(this::toPaymentDTO)  // ✅ now maps rentPayment → DTO
            .collect(Collectors.toList());
}
}


