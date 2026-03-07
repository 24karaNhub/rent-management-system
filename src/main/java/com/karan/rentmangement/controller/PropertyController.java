package com.karan.rentmangement.controller;
import com.karan.rentmangement.service.PropertyService;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;

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
        this.propertyService=propertyService;
    }
    @PostMapping("/addProperty")
    public Property createProperty(@RequestBody Property property){
        return propertyService.createProperty(property);
    }
    @GetMapping
    public List<Property> getallProperties(){
        return propertyService.getAllProperty();
    }
    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable int id, @RequestBody Property property){
        return propertyService.updateProperty(id, property);
    }
    @DeleteMapping("/{id}")        // ✅ added delete
    public String deleteTenant(@PathVariable int id){
        propertyService.deleteTenant(id);
        return "Property deleted successfully"; // Return a success message
    }
    @GetMapping("/{id}/tenants")
    public List<Tenant> getTenantsOfProperty(@PathVariable int id){
    return propertyService.getTenantsOfProperty(id);
    }
    @GetMapping("/{id}/payments")
    public List<rentPayment> getPaymentsOfProperty(@PathVariable int id){
        return propertyService.getPaymentsOfProperty(id);
}
}
