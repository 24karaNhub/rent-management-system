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
 import com.karan.rentmangement.model.Landlord;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
public class Landlord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|googlemail\\.com)$",
        message = "Email must be a valid Gmail address"
    )
    private String email;

    @Size(min = 10, max = 10, message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Password cannot be blank")
    private String password;   // 🔥 REQUIRED FOR LOGIN

    // 🔥 prevent infinite JSON loop
    @OneToMany(mappedBy = "landlord")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Tenant> tenants;

    @OneToMany(mappedBy = "landlord")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Property> properties;

    public Landlord() {}

    public Landlord(String name, String email, String phone, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    // ─── getters & setters ───
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Tenant> getTenants() { return tenants; }
    public void setTenants(List<Tenant> tenants) { this.tenants = tenants; }

    public List<Property> getProperties() { return properties; }
    public void setProperties(List<Property> properties) { this.properties = properties; }
}