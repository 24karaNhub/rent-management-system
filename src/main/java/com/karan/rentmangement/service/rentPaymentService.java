package com.karan.rentmangement.service;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

import org.springframework.stereotype.Service;
import com.karan.rentmangement.repository.rentPaymentRepo;

import jakarta.validation.constraints.Null;
import com.karan.rentmangement.repository.*;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.DTO.RequestDTO.RentPaymentRequestDTO;
import com.karan.rentmangement.DTO.ResponeDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.DTO.ResponeDTO.TenantResponseDTO;
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

        payment.setAmount(dto.getAmount());
        payment.setDate(LocalDate.parse(dto.getDate()));
        payment.setMonth(Month.valueOf(dto.getMonth()));
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
        dto.setAmount(rentPayment.getAmount());
        dto.setDate(rentPayment.getDate().toString());
        dto.setMonth(rentPayment.getMonth().toString());
        dto.setStatus(rentPayment.getStatus());
        if (rentPayment.getLandlord() != null) {
            dto.setLandlordName(rentPayment.getLandlord().getName());
            
            
        }
        if (rentPayment.getTenant() != null) {
            dto.setTenantName(rentPayment.getTenant().getName());
        }

        // 🔥 THIS ALSO
        if (rentPayment.getProperty() != null) {
            dto.setPropertyName(rentPayment.getProperty().getAddress());
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
    public List<RentPaymentResponseDTO> getAllPayments() {

    return rentpaymentRepo.findAll()
            .stream()
            .map(this::tResponseDTO)
            .toList();
}
}