package com.karan.rentmangement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.JoinColumn;

import java.time.Month;
import java.time.LocalDate;

@Entity
public class rentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Min(value = 1, message = "Rent must be greater than 0")
    @NotNull(message = "Rent should not be blank")
    private long amount;
    @NotNull(message = "Month should not be blank")
    private Month month;
    @NotBlank(message = "Status should not be blank")
    private String status;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "landlord_id")
    private Landlord landlord;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    public rentPayment(long amount, Month month, String status, LocalDate date) {
        this.amount = amount;
        this.month = month;
        this.status = status;
        this.date = date;
    }

    public rentPayment() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }


    public Month getMonth() {
        return month;
    }

    public void setMonth(Month month) {
        this.month = month;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    public Landlord getLandlord() {
        return landlord;
    }

    public void setLandlord(Landlord landlord) {
        this.landlord = landlord;
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