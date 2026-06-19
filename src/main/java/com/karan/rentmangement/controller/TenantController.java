package com.karan.rentmangement.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;  // Added import for DeleteMapping
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.karan.rentmangement.service.TenantService;

import jakarta.validation.Valid;

import com.karan.rentmangement.DTO.RequestDTO.TenantRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.TenantResponseDTO;

@RestController
@RequestMapping("/tenants")        // ✅ lowercase + plural
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService){
        this.tenantService = tenantService;   // ✅ constructor injection
    }

    @PostMapping                   // ✅ no /addtenant
    public ResponseEntity<TenantResponseDTO> createTenant(@RequestBody @Valid TenantRequestDTO dto){
        return ResponseEntity
                .status(201)
                .body(tenantService.createTenant(dto));
        
    }

    @GetMapping
    public  ResponseEntity<List<TenantResponseDTO>> getAllTenants(){
        return ResponseEntity.ok(tenantService.getAllTenants()); // ✅ camelCase
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantResponseDTO> getById(@PathVariable int id){  // ✅ Long not int
        return ResponseEntity.ok(tenantService.getById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<TenantResponseDTO> updateTenant(@PathVariable int id, @RequestBody @Valid TenantRequestDTO dto){
        return 
        ResponseEntity.ok(tenantService.updateTenant(id,dto));
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<TenantResponseDTO> updateStatus(@PathVariable int id, @RequestBody String status) {
        String cleanedStatus = status.replace("\"", "").trim();
        return ResponseEntity.ok(tenantService.updateStatus(id, cleanedStatus));
    }
    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<TenantResponseDTO>> getTenantsByLandlord(@PathVariable int landlordId) {
        return ResponseEntity.ok(tenantService.getTenantsByLandlord(landlordId));
    }
    @DeleteMapping("/{id}")
public ResponseEntity<String> deleteTenant(@PathVariable int id){
    
    String message = tenantService.deleteTenant(id);

    return ResponseEntity.ok(message);
}
    @GetMapping("/{id}/payments")
    public ResponseEntity<List<RentPaymentResponseDTO>> getPaymentsOfTenant(@PathVariable int id){
        return ResponseEntity.ok(tenantService.getPaymentsOfTenant(id));
}


    
}