package com.karan.rentmangement.model;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import com.karan.rentmangement.model.Landlord;

@Entity
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank(message = "Address should not be blank")
    private String Address;
   @NotBlank(message = "Rent should not be blank")
   
    @Min(value = 1, message = "Rent must be greater than 0")
    private long rent;
   @NotBlank(message = "Type  should not be blank")
    private String type;
    @NotBlank(message = "City  should not be blank")
    private String city ;
    @ManyToOne
    @JoinColumn(name = "landlord_id")
    private Landlord landlord;

    public Property(String address, long rent, String type, String city, Landlord landlord) {
        this.Address = address;
        this.rent = rent;
        this.type = type;
        this.city = city;
        this.landlord = landlord;
    }

    public Property(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public long getRent() {
        return rent;
    }

    public void setRent(long rent) {
        this.rent = rent;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
    public Landlord getLandlord() {
        return landlord;
    }

    public void setLandlord(Landlord landlord) {
        this.landlord = landlord;
    }
}

