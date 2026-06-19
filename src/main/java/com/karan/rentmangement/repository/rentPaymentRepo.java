package com.karan.rentmangement.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.rentPayment;

@Repository
public interface rentPaymentRepo extends JpaRepository<rentPayment, Integer> {
     List<rentPayment> findByProperty(Property property);
     List<rentPayment> findByTenant(Tenant tenant);
     List<rentPayment> findByTenantOrderByDateDesc(Tenant tenant);
     List<rentPayment> findByLandlord(Landlord landlord);
     List<rentPayment> findByLandlordId(int landlordId);
     @Modifying
@Query("UPDATE rentPayment rp SET rp.landlord = null WHERE rp.landlord.id = :landlordId")
void unlinkLandlord(@Param("landlordId") int landlordId);
}