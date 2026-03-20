package com.karan.rentmangement.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;  // Added import for DeleteMapping
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.karan.rentmangement.service.TenantService;

import jakarta.validation.Valid;

import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;

@RestController
@RequestMapping("/tenants")        // ✅ lowercase + plural
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService){
        this.tenantService = tenantService;   // ✅ constructor injection
    }

    @PostMapping                   // ✅ no /addtenant
    public Tenant createTenant(@RequestBody @Valid Tenant tenant){
        return tenantService.createTenant(tenant);
    }

    @GetMapping
    public List<Tenant> getAllTenants(){
        return tenantService.getAllTenants();  // ✅ camelCase
    }

    @GetMapping("/{id}")
    public Tenant getById(@PathVariable int id){  // ✅ Long not int
        return tenantService.getById(id);
    }

    @PutMapping("/{id}")
    public Tenant updateTenant(@PathVariable int id, @RequestBody @Valid Tenant tenant){
        return tenantService.updateTenant(id, tenant);
    }

    @DeleteMapping("/{id}")        // ✅ added delete
    public String deleteTenant(@PathVariable int id){
        tenantService.deleteTenant(id);
        return "Tenant deleted successfully"; // Return a success message
    }
    @GetMapping("/{id}/payments")
    public List<rentPayment> getPaymentsOfTenant(@PathVariable int id){
        return tenantService.getPaymentsOfTenant(id);
}

    
}