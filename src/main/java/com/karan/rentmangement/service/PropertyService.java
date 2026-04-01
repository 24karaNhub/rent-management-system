package com.karan.rentmangement.service;
import com.karan.rentmangement.DTO.ResponeDTO.LandlordResponseDTO;
import org.springframework.stereotype.Service;

import com.karan.rentmangement.DTO.RequestDTO.PropertyRequestDTO;
import com.karan.rentmangement.DTO.ResponeDTO.PropertyResponseDTO;
import com.karan.rentmangement.DTO.ResponeDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.DTO.ResponeDTO.TenantResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.*;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Property;
import java.util.List;

@Service
public class PropertyService {

    private final TenantRepo tenantRepo;
    private final PropertyRepo propertyRepo;
    private final rentPaymentRepo rentpaymentRepo;
    private final LandlordRepo landlordRepo;
    public PropertyService(PropertyRepo propertyRepo, TenantRepo tenantRepo, rentPaymentRepo rentpaymentRepo, LandlordRepo landlordRepo){
        this.propertyRepo=propertyRepo;
        this.tenantRepo = tenantRepo;
        this.rentpaymentRepo=rentpaymentRepo;
        this.landlordRepo=landlordRepo;
    }
    private Property toEntity(PropertyRequestDTO dto){

    Property property = new Property();

    property.setType(dto.getType());
    property.setRent(dto.getRent());
    property.setCity(dto.getCity());
    property.setAddress(dto.getAddress());

    Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
            .orElseThrow(() -> new RuntimeException("Landlord not found"));

    property.setLandlord(landlord);

    return property;
}
private PropertyResponseDTO toResponseDTO(Property property){

    PropertyResponseDTO dto = new PropertyResponseDTO();

    dto.setId(property.getId());
    dto.setType(property.getType());
    dto.setRent(property.getRent());
    dto.setCity(property.getCity());
    dto.setAddress(property.getAddress());

    if(property.getLandlord() != null){
        dto.setLandlordName(property.getLandlord().getName());
    }

    return dto;
}
private TenantResponseDTO toTenantDTO(Tenant tenant){

    TenantResponseDTO dto = new TenantResponseDTO();

    dto.setId(tenant.getid());
    dto.setName(tenant.getName());
    dto.setEmail(tenant.getEmail());
    dto.setPhone(tenant.getPhone());
    dto.setRent(tenant.getRent());

    if (tenant.getLandlord() != null) {
        dto.setLandlordName(tenant.getLandlord().getName());
    }

    if (tenant.getProperty() != null) {
        dto.setPropertyAddress(tenant.getProperty().getAddress());
    }

    return dto;
}
private RentPaymentResponseDTO toPaymentDTO(rentPayment payment){

    RentPaymentResponseDTO dto = new RentPaymentResponseDTO();

    dto.setId(payment.getId());
    dto.setAmount(payment.getAmount());
    dto.setDate(payment.getDate().toString());
    dto.setMonth(payment.getMonth().toString());
    dto.setStatus(payment.getStatus());

    if (payment.getLandlord() != null) {
        dto.setLandlordName(payment.getLandlord().getName());
    }

    

    return dto;
}
    private LandlordResponseDTO toLandlordDTO(Landlord landlord) {
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        return dto;
    }



    public PropertyResponseDTO createProperty(PropertyRequestDTO dto){

    Property property = toEntity(dto);

    Property saved = propertyRepo.save(property);

    return toResponseDTO(saved);
}
    
public List<PropertyResponseDTO> getAll(){

    return propertyRepo.findAll()
            .stream()
            .map(this::toResponseDTO)
            .toList();
}
    public PropertyResponseDTO getById(int id){

    Property property = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));

    return toResponseDTO(property);
}
    public PropertyResponseDTO update(int id, PropertyRequestDTO dto){

    Property existing = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));

    existing.setType(dto.getType());
    existing.setRent(dto.getRent());
    existing.setCity(dto.getCity());
    existing.setAddress(dto.getAddress());

    Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
            .orElseThrow(() -> new RuntimeException("Landlord not found"));

    existing.setLandlord(landlord);

    return toResponseDTO(propertyRepo.save(existing));
}
   public String deleteProperty(int id){

    Property existing = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found"));

    propertyRepo.delete(existing);

    return "Property deleted successfully";
}
     public String deleteTenant(int id){
        Property existing = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
    propertyRepo.delete(existing);
    return "Property  deleted successfully";
}
    public List<TenantResponseDTO> getTenantsOfProperty(int id){

    Property property = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found"));

    return tenantRepo.findByProperty(property)
            .stream()
            .map(this::toTenantDTO)
            .toList();
}
public List<RentPaymentResponseDTO> getPaymentsOfProperty(int id){

    Property property = propertyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found"));

    return rentpaymentRepo.findByProperty(property)
            .stream()
            .map(this::toPaymentDTO)
            .toList();
}
    public LandlordResponseDTO getLandlordOfProperty(int id) {
        Property property = propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Landlord landlord = property.getLandlord();
        if (landlord == null) {
            throw new RuntimeException("No landlord assigned to this property");
        }

        return toLandlordDTO(landlord);
    }
}
