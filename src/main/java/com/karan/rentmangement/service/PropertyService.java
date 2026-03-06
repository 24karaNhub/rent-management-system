package com.karan.rentmangement.service;
import com.karan.rentmangement.repository.TenantRepo;
import org.springframework.stereotype.Service;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.model.Property;
import java.util.List;

@Service
public class PropertyService {

    private final TenantRepo tenantRepo;
    private final PropertyRepo propertyRepo;
    public PropertyService(PropertyRepo propertyRepo, TenantRepo tenantRepo){
        this.propertyRepo=propertyRepo;
        this.tenantRepo = tenantRepo;
    }
    public Property createProperty(Property property){
        return propertyRepo.save(property);
    }
    public List<Property> getAllProperty(){
        return propertyRepo.findAll();
    }
    public Property getById(int id){
        return propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("No Property found"));
    }
    public Property updateProperty(int id , Property property){
        Property existing = propertyRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("NOT FOUND"));
        existing.setAddress(property.getAddress());
        existing.setCity(property.getCity());
        existing.setLandlord(property.getLandlord());
        existing.setRent(property.getRent());
        existing.setType(property.getType());
        return  propertyRepo.save(existing);
    }
    public String deleteProperty(int id){
        Property existing=propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        propertyRepo.delete(existing);
        return "Property Deleted Succesfully";
    }
     public String deleteTenant(int id){
        Property existing = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
    propertyRepo.delete(existing);
    return "Property  deleted successfully";
}
    public List<Tenant> getTenantsOfProperty(int id){

    Property property = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found"));

    return tenantRepo.findByProperty(property);
}
}
