package com.karan.rentmangement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.karan.rentmangement.repository.rentPaymentRepo;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
@Service
public class rentPaymentService {
    private final rentPaymentRepo rentpaymentRepo;
    private final LandlordRepo landlordRepo;
    private final PropertyRepo propertyRepo;
    
    public rentPaymentService(rentPaymentRepo rentpaymentRepo, LandlordRepo landlordRepo, PropertyRepo propertyRepo){
        this.rentpaymentRepo=rentpaymentRepo;
        this.landlordRepo=landlordRepo;
        this.propertyRepo=propertyRepo;
    }
    public rentPayment createRentPayment(rentPayment payment){

    int landlordId = payment.getLandlord().getId();
    int propertyId = payment.getProperty().getId();

    Landlord landlord = landlordRepo.findById(landlordId)
            .orElseThrow(() -> new RuntimeException("Landlord not found"));

    Property property = propertyRepo.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found"));

    payment.setLandlord(landlord);
    payment.setProperty(property);

    return rentpaymentRepo.save(payment);
}
public String deleteRentpayment(int id ){
    rentPayment exisisting = rentpaymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    rentpaymentRepo.delete(exisisting);
    return "payment deleted succesfully ";
}
public rentPayment getbyid(int id){
    return rentpaymentRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found "));
}
public List<rentPayment> getAllPayments(){
    return rentpaymentRepo.findAll();
}
}
