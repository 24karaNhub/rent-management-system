package com.karan.rentmangement.service;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

import org.springframework.stereotype.Service;

import com.karan.rentmangement.repository.*;
import com.karan.rentmangement.DTO.RequestDTO.RentPaymentRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
@Service
public class rentPaymentService {

    private final rentPaymentRepo rentpaymentRepo;
    private final LandlordRepo landlordRepo;
    private final PropertyRepo propertyRepo;
    private final TenantRepo tenantRepo;

    public rentPaymentService(rentPaymentRepo rentpaymentRepo, LandlordRepo landlordRepo, PropertyRepo propertyRepo ,TenantRepo tenantRepo){
        this.rentpaymentRepo = rentpaymentRepo;
        this.landlordRepo = landlordRepo;
        this.propertyRepo = propertyRepo;
        this.tenantRepo=tenantRepo;
    }

    // ✅ FIXED: proper DTO → Entity conversion
    private rentPayment toEntity(RentPaymentRequestDTO dto){
        rentPayment payment = new rentPayment();

        payment.setRent(dto.getRent());
        payment.setDate(LocalDate.parse(dto.getDate()));
        payment.setMonth(
    Month.valueOf(dto.getMonth().toUpperCase())
);
        payment.setStatus(dto.getStatus());

        // landlord fetch
        Landlord landlord = landlordRepo.findById(dto.getLandlordId())
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        // property fetch
        Property property = propertyRepo.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Tenant tenant = tenantRepo.findById(dto.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        payment.setTenant(tenant);

        payment.setLandlord(landlord);
        payment.setProperty(property);

        return payment;
    }

    // ✅ FIXED: now takes DTO
    public RentPaymentResponseDTO createRentPayment(RentPaymentRequestDTO dto){

        rentPayment payment = toEntity(dto);

        
         rentPayment saved =rentpaymentRepo.save(payment);
         return tResponseDTO(saved);
    }
    // private TenantResponseDTO tResponseDTO(Tenant tenant){
    //     TenantResponseDTO dto = new TenantResponseDTO();
    //     dto.setId(tenant.getid());
    //     dto.setName(tenant.getName());
    //     dto.setEmail(tenant.getEmail());
    //     dto.setPhone(tenant.getPhone());
    //     dto.setRent(tenant.getRent());    // ✅ add rent
    
    // if (tenant.getLandlord() != null) {
    //     dto.setLandlordName(tenant.getLandlord().getName());
    // }

    // if (tenant.getProperty() != null) {
    //     dto.setPropertyAddress(tenant.getProperty().getAddress());
    // }

    //     return dto;
    // }
    private RentPaymentResponseDTO tResponseDTO(rentPayment rentPayment){
        RentPaymentResponseDTO dto = new RentPaymentResponseDTO();
        dto.setId(rentPayment.getId());
        dto.setAmount(rentPayment.getRent());
        if (rentPayment.getDate() != null) {
            dto.setDate(rentPayment.getDate().toString());
        }
        if (rentPayment.getMonth() != null) {
            dto.setMonth(rentPayment.getMonth().toString());
        }
        dto.setStatus(rentPayment.getStatus());
        if (rentPayment.getLandlord() != null) {
            dto.setLandlordName(rentPayment.getLandlord().getName());
        }
        if (rentPayment.getTenant() != null) {
            dto.setTenantName(rentPayment.getTenant().getName());
            dto.setTenantId(rentPayment.getTenant().getid());
        }

        // 🔥 THIS ALSO
        if (rentPayment.getProperty() != null) {
            dto.setPropertyName(rentPayment.getProperty().getAddress());
            dto.setPropertyId(rentPayment.getProperty().getId());
        }

        return dto;
    }

    public String deleteRentpayment(int id) {
    rentPayment existing = rentpaymentRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    rentpaymentRepo.delete(existing);
    return "Payment deleted successfully";
}

    public RentPaymentResponseDTO getbyid(int id) {

    rentPayment payment = rentpaymentRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    return tResponseDTO(payment);
}
public List<RentPaymentResponseDTO> getAllPaymentByLandlord(int id){
    Landlord landlord = this.landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
    return rentpaymentRepo.findByLandlordId(id)
            .stream()
            .map(this::tResponseDTO)
            .toList();
}
    public List<RentPaymentResponseDTO> getAllPayments() {

    return rentpaymentRepo.findAll()
            .stream()
            .map(this::tResponseDTO)
            .toList();
}

    public RentPaymentResponseDTO updateRentPayment(int id, RentPaymentRequestDTO dto) {
        rentPayment existing = rentpaymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        existing.setRent(dto.getRent());
        existing.setDate(LocalDate.parse(dto.getDate()));
        existing.setMonth(Month.valueOf(dto.getMonth().toUpperCase()));
        existing.setStatus(dto.getStatus());

        if (existing.getLandlord().getId() != dto.getLandlordId()) {
            Landlord landlord = landlordRepo.findById(dto.getLandlordId())
                    .orElseThrow(() -> new RuntimeException("Landlord not found"));
            existing.setLandlord(landlord);
        }
        if (existing.getProperty().getId() != dto.getPropertyId()) {
            Property property = propertyRepo.findById(dto.getPropertyId())
                    .orElseThrow(() -> new RuntimeException("Property not found"));
            existing.setProperty(property);
        }
        if (existing.getTenant().getid() != dto.getTenantId()) {
            Tenant tenant = tenantRepo.findById(dto.getTenantId())
                    .orElseThrow(() -> new RuntimeException("Tenant not found"));
            existing.setTenant(tenant);
        }

        rentPayment saved = rentpaymentRepo.save(existing);
        return tResponseDTO(saved);
    }

    public RentPaymentResponseDTO updatePaymentStatus(int id, String status) {
        rentPayment existing = rentpaymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        existing.setStatus(status.toUpperCase());
        if ("PAID".equalsIgnoreCase(status) && existing.getDate() == null) {
            existing.setDate(LocalDate.now());
        }

        rentPayment saved = rentpaymentRepo.save(existing);
        return tResponseDTO(saved);
    }
}