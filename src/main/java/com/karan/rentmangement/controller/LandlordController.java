package com.karan.rentmangement.controller;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.repository.LandlordRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import com.karan.rentmangement.service.*;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/landlord")
public class LandlordController {
    private final LandlordService landlordService;
    public LandlordController(LandlordService landlordService){
        this.landlordService=landlordService;
    }
    @PostMapping("/addlandlord")
    public Landlord createLandlord(@RequestBody Landlord landlord) {
        return landlordService.createLandlord(landlord);
    }

    

    @GetMapping
    public List<Landlord> getallLandlords() {
        return landlordService.getallLandlords();
    }

    @GetMapping("/{id}")
    public Landlord getById(@PathVariable int id) {
        return landlordService.getById(id);
    }

    @PutMapping("/{id}")
    public Landlord updateLandlord(@PathVariable int id, @RequestBody Landlord landlord) {
        return landlordService.updateLandlord(id,landlord);


    }

}
