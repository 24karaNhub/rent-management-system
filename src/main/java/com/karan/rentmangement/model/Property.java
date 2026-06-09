package com.karan.rentmangement.model;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.karan.rentmangement.model.Landlord;

@Entity
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private int totalRooms;

    @NotBlank(message = "Address should not be blank")
    private String Address;
    @NotNull(message = "Rent cannot be null")
    @Positive(message = "Rent must be greater than 0")
    private Long rent;
   @NotBlank(message = "Type  should not be blank")
    private String type;
    @NotBlank(message = "City  should not be blank")
    private String city ;
    @ManyToOne
    @JoinColumn(name = "landlord_id")
    private Landlord landlord;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Room> rooms = new java.util.ArrayList<>();

    public Property(String name, int totalRooms, String address, long rent, String type, String city, Landlord landlord) {
        this.name = name;
        this.totalRooms = totalRooms;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public java.util.List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(java.util.List<Room> rooms) {
        this.rooms = rooms;
    }
}

