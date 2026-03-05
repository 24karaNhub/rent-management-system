package com.karan.rentmangement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Tenant {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id ;
    private String name ;
    private String email;
    private String phone;
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
}
