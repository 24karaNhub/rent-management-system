package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.karan.rentmangement.model.Property;
@Repository
public interface PropertyRepo extends JpaRepository<Property, Integer> {

}