package com.karan.rentmangement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.TenantRepo;

@Service
public class TenantService {

    private final LandlordRepo landlordRepo;
    private final TenantRepo tenantRepo;
    public TenantService(TenantRepo tenantRepo, LandlordRepo landlordRepo){
        this.tenantRepo = tenantRepo;
        this.landlordRepo = landlordRepo;
    }
    public Tenant createTenant( Tenant tenant){
        return tenantRepo.save(tenant);
    }
    public List<Tenant> getAllTenants(){
        return tenantRepo.findAll();
    }
    public Tenant getById( int  id){
        return tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not Found"));
    }
    public Tenant updateTenant( int id,  Tenant tenant){
        Tenant existing = tenantRepo.findById(id)
               .orElseThrow(() -> new RuntimeException("Not found"));
        existing.setName(tenant.getName());
        existing.setEmail(tenant.getEmail());
        existing.setPhone(tenant.getPhone());
        existing.setRent(tenant.getRent());
        existing.setLandlord(tenant.getLandlord());
        existing.setProperty(tenant.getProperty());
        return tenantRepo.save(existing);

    }
    public String deleteTenant(int id){
    Tenant existing = tenantRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
    tenantRepo.delete(existing);
    return "Tenant deleted successfully";
}
}
