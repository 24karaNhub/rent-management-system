package com.karan.rentmangement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
public class Landlord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id ;
    @NotNull(message = "Name cannot be null")
    @NotEmpty(message = "Name cannot be Empty")
    @NotBlank(message = "Name cannot be Blank ")
    private String name ;
    @NotBlank(message = "Email cannot be Blank ")
    @Email(message = "Email should be in proper format")
    @Pattern(
    regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|googlemail\\.com)$",
    message = "Email must be a valid Gmail address")
    private String email;
    @Size(min = 10 , max = 10, message = "Phone number must contain 10 digits ")
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
