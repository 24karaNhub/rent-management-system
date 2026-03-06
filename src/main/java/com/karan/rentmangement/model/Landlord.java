package com.karan.rentmangement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;

@Entity
public class Landlord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id ;
    private String name ;
    private String email;
    private String phone;
    
    public Landlord( String name, String email, String phone) {
       
        this.name = name;
        this.email = email;
        this.phone=phone;
    }

    @OneToMany(mappedBy = "landlord")
    private List<Tenant> tenants;
    @OneToMany(mappedBy = "landlord")
    private List<Property> property;

    public Landlord() {

    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String  phone) {
        this.phone = phone;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }
}
