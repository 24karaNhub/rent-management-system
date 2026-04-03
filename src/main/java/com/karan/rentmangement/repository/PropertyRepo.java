package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.karan.rentmangement.model.Property;

import java.util.List;

@Repository
public interface PropertyRepo extends JpaRepository<Property, Integer> {

    List<Property> findByLandlordId(int landlordId);
}