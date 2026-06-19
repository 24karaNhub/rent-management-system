package com.karan.rentmangement.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String roomNumber;
    private Long rent;
    private String status = "VACANT"; // "VACANT", "OCCUPIED"

    @ManyToOne
    @JoinColumn(name = "property_id")
    @JsonIgnoreProperties("rooms")
    private Property property;

    @OneToOne
    @JoinColumn(name = "tenant_id", nullable = true)
    @JsonIgnoreProperties({"room", "property", "landlord"})
    private Tenant tenant;

    public Room() {}

    public Room(String roomNumber, Long rent, String status, Property property) {
        this.roomNumber = roomNumber;
        this.rent = rent;
        this.status = status;
        this.property = property;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Long getRent() {
        return rent;
    }

    public void setRent(Long rent) {
        this.rent = rent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }
}
