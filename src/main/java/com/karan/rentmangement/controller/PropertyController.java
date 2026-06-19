package com.karan.rentmangement.controller;
import com.karan.rentmangement.service.PropertyService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import com.karan.rentmangement.DTO.RequestDTO.PropertyRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.PropertyResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.TenantResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RentPaymentResponseDTO;

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
    // GET /property/landlord/10  → only landlord 10's properties
    @GetMapping("/landlord/{landlordId}")
    public List<PropertyResponseDTO> getByLandlord(@PathVariable int landlordId) {
        return propertyService.getPropertiesByLandlord(landlordId);
    }
    // ✅ GET PAYMENTS OF PROPERTY
    @GetMapping("/{id}/payments")
    public ResponseEntity<List<RentPaymentResponseDTO>> getPaymentsOfProperty(
            @PathVariable int id) {
        return ResponseEntity.ok(propertyService.getPaymentsOfProperty(id));
    }

    // ✅ GET ROOMS OF PROPERTY
    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<com.karan.rentmangement.DTO.ResponseDTO.RoomResponseDTO>> getRoomsOfProperty(
            @PathVariable int id) {
        return ResponseEntity.ok(propertyService.getRoomsOfProperty(id));
    }
}