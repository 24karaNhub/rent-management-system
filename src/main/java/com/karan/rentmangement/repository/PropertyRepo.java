package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.karan.rentmangement.model.Property;

import java.util.List;

import java.util.Optional;

@Repository
public interface PropertyRepo extends JpaRepository<Property, Integer> {

    List<Property> findByLandlordId(int landlordId);
    @Query("SELECT p FROM Property p WHERE p.Address = :address AND p.landlord.id = :landlordId")
    Optional<Property> findByAddressAndLandlordId(@Param("address") String address, @Param("landlordId") int landlordId);
    @Modifying
@Query("UPDATE Property p SET p.landlord = null WHERE p.landlord.id = :landlordId")
void unlinkLandlord(@Param("landlordId") int landlordId);
}