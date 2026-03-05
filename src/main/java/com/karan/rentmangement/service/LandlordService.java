package com.karan.rentmangement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.repository.LandlordRepo;

@Service
public class LandlordService {
    private final LandlordRepo landlordRepo;
    public LandlordService(LandlordRepo landlordRepo){
        this.landlordRepo=landlordRepo;
    }
    public Landlord createLandlord(@RequestBody Landlord landlord) {
        return landlordRepo.save(landlord);


    }
    public List<Landlord> getallLandlords() {
        return landlordRepo.findAll();
    }
    public Landlord getById(@PathVariable int id) {
        return landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
    }
     public Landlord updateLandlord(@PathVariable int id, @RequestBody Landlord landlord) {
        Landlord existing = landlordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("not found"));
        existing.setName(landlord.getName());
        existing.setEmail(landlord.getEmail());
        existing.setPhone(landlord.getPhone());
        return landlordRepo.save(existing);


    }
}
