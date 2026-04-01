package com.karan.rentmangement.controller;
import com.karan.rentmangement.DTO.ResponeDTO.LandlordResponseDTO;
import com.karan.rentmangement.service.PropertyService;

import jakarta.validation.Valid;

import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import org.springframework.http.ResponseEntity;
import com.karan.rentmangement.DTO.RequestDTO.PropertyRequestDTO;
import com.karan.rentmangement.DTO.ResponeDTO.PropertyResponseDTO;
import com.karan.rentmangement.DTO.ResponeDTO.TenantResponseDTO;
import com.karan.rentmangement.DTO.ResponeDTO.RentPaymentResponseDTO;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/property")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService){
        this.propertyService = propertyService;
    }

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<PropertyResponseDTO> createProperty(
            @RequestBody @Valid PropertyRequestDTO dto){

        return ResponseEntity
                .status(201)
                .body(propertyService.createProperty(dto));
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties(){

        return ResponseEntity
                .ok(propertyService.getAll());
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> getById(@PathVariable int id){

        return ResponseEntity
                .ok(propertyService.getById(id));
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> updateProperty(
            @PathVariable int id,
            @RequestBody @Valid PropertyRequestDTO dto){

        return ResponseEntity
                .ok(propertyService.update(id, dto));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable int id){

        return ResponseEntity
                .ok(propertyService.deleteProperty(id));
    }

    // ✅ GET TENANTS OF PROPERTY
    @GetMapping("/{id}/tenants")
    public ResponseEntity<List<TenantResponseDTO>> getTenantsOfProperty(
            @PathVariable int id){

        return ResponseEntity
                .ok(propertyService.getTenantsOfProperty(id));
    }
    @GetMapping("/landlord/{id}")
    public ResponseEntity<LandlordResponseDTO> getLandlordOfProperty(@PathVariable int id) {
        return ResponseEntity.ok(propertyService.getLandlordOfProperty(id));
    }
    // ✅ GET PAYMENTS OF PROPERTY
    @GetMapping("/{id}/payments")
    public ResponseEntity<List<RentPaymentResponseDTO>> getPaymentsOfProperty(
            @PathVariable int id){

        return ResponseEntity
                .ok(propertyService.getPaymentsOfProperty(id));
    }
}