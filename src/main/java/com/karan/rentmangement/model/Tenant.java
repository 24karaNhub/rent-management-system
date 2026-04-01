package com.karan.rentmangement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

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

@Column(name = "move_in_date")
private LocalDate moveInDate;
private LocalDate moveOutDate;
private String aadhaar;
    public Tenant(String name, String email, String phone , Long rent, LocalDate moveInDate, LocalDate moveOutDate, String aadhaar) {
        this.name=name;
        this.email=email;
        this.phone=phone;
        this.rent=rent;
        this.moveInDate=moveInDate;
        this.moveOutDate=moveOutDate;
        this.aadhaar=aadhaar;
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

   public LocalDate getMoveInDate() {
    return moveInDate;
}

    public void setMoveInDate(LocalDate moveInDate) {
        this.moveInDate = moveInDate;
}
    

    public void setAadhaar(String aadhaar) {
        this.aadhaar = aadhaar;
    }
    public String getAadhaar() {
        return aadhaar;
    }
    public LocalDate getMoveOutDate(){
        return moveOutDate;
    }
    
    public void setMoveOutDate(LocalDate moveOutDate) {
        this.moveOutDate = moveOutDate;
    }
}
