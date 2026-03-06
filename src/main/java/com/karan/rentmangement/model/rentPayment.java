package com.karan.rentmangement.model;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class rentPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private long amount;
    private String month;
    private String status;
    private String date;
    public rentPayment(long amount,String month, String status, String date){
        this.amount=amount;
        this.month=month;
        this.status=status;
        this.date=date;
    }
    public rentPayment(){}
    private Landlord landlord;
    private Property property;

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

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
