package com.karan.rentmangement.controller;
import com.karan.rentmangement.DTO.RequestDTO.LandlordRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import com.karan.rentmangement.service.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/landlord")
public class LandlordController {
    private final LandlordService landlordService;
    public LandlordController(LandlordService landlordService){
        this.landlordService=landlordService;
    }
    @PostMapping
    public ResponseEntity<LandlordResponseDTO>  createLandlord(@RequestBody  @Valid LandlordRequestDTO dto) {
        return ResponseEntity
                .status(201)
                .body(landlordService.createLandlord(dto));
    }

    

    @GetMapping
    public ResponseEntity <List<LandlordResponseDTO>> getallLandlords() {
        return ResponseEntity.ok(landlordService.getAllLandlords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LandlordResponseDTO> getById(@PathVariable int id) {
        return ResponseEntity.ok(landlordService.getById(id));
    }

    @PutMapping("/{id}")
    public  ResponseEntity<LandlordResponseDTO> updateLandlord(@PathVariable int id, @RequestBody LandlordRequestDTO dto) {
        return ResponseEntity.ok(landlordService.updateLandlord(id,dto));


    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLandlord(@PathVariable int id) {
        landlordService.deleteLandlord(id);
        return ResponseEntity.ok("Landlord deleted successfully");
    }
}
