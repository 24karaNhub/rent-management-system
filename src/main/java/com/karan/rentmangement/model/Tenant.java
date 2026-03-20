package com.karan.rentmangement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
public class Tenant {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id ;
     @NotBlank(message = "Name cannot be blank")
private String name;

@NotBlank(message = "Email cannot be blank")
@Email(message = "Email should be valid")
@Pattern(
    regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|googlemail\\.com)$",
    message = "Email must be a valid Gmail address"
)
private String email;

@Pattern(regexp = "\\d{10}", message = "Phone must be exactly 10 digits")
private String phone;

@NotNull(message = "Rent cannot be null")
@Positive(message = "Rent must be greater than 0")
private Long rent;
    public Tenant(String name, String email, String phone , Long rent){
        this.name=name;
        this.email=email;
        this.phone=phone;
        this.rent=rent;
    }
    
    @ManyToOne
    @JoinColumn(name="landlord_id")
    private Landlord landlord;
    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
    public Tenant() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setId(int id){
        this.id=id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getRent() {
        return rent;
    }

    public void setRent(Long rent) {
        this.rent = rent;
    }
    public int getid(){
        return id;
    }
    public Landlord getLandlord(){
        return landlord;
    }
    public void setLandlord(Landlord landlord) {
        this.landlord = landlord;
    }
    public Property getProperty(){
        return property;
    }
    public void setProperty(Property property){
        this.property=property;
    }
}
