package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.karan.rentmangement.model.Property;

import java.util.List;

@Repository
public interface PropertyRepo extends JpaRepository<Property, Integer> {

    List<Property> findByLandlordId(int landlordId);
    @Modifying
@Query("UPDATE Property p SET p.landlord = null WHERE p.landlord.id = :landlordId")
void unlinkLandlord(@Param("landlordId") int landlordId);
}