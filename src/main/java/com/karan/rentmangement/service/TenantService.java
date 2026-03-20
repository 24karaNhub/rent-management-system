package com.karan.rentmangement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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
    
    public Tenant createTenant(Tenant tenant){

    if (tenant.getLandlord() != null) {
        int landlordId = tenant.getLandlord().getId();

        Landlord landlord = landlordRepo.findById(landlordId)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        tenant.setLandlord(landlord);
    }

    if (tenant.getProperty() != null) {
        int propertyId = tenant.getProperty().getId();

        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        tenant.setProperty(property);
    }

    return tenantRepo.save(tenant);
}
    public List<Tenant> getAllTenants(){
        return tenantRepo.findAll();
    }
    public Tenant getById( int  id){
        return tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not Found"));
    }
    public Tenant updateTenant(int id, Tenant tenant){

    // 1️⃣ Fetch existing tenant
    Tenant existing = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Tenant not found"));

    // 2️⃣ Update basic fields
    existing.setName(tenant.getName());
    existing.setEmail(tenant.getEmail());
    existing.setPhone(tenant.getPhone());
    existing.setRent(tenant.getRent());

    // 3️⃣ Handle landlord relation (IMPORTANT 🔥)
    if (tenant.getLandlord() != null) {
        int landlordId = tenant.getLandlord().getId();

        Landlord landlord = landlordRepo.findById(landlordId)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        existing.setLandlord(landlord);
    }

    // 4️⃣ Handle property relation
    if (tenant.getProperty() != null) {
        int propertyId = tenant.getProperty().getId();

        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        existing.setProperty(property);
    }

    // 5️⃣ Save updated tenant
    return tenantRepo.save(existing);
}
    public String deleteTenant(int id){
    Tenant existing = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
    tenantRepo.delete(existing);
    return "Tenant deleted successfully";
}
    public List<rentPayment> getPaymentsOfTenant(int id){

    Tenant tenant = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Tenant not found"));

    return rentpaymentRepo.findByTenant(tenant);
}
}
