package com.karan.rentmangement.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.karan.rentmangement.DTO.ResponeDTO.TenantResponseDTO;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;

@Repository
public interface rentPaymentRepo extends JpaRepository<rentPayment, Integer> {
    List<rentPayment> findByProperty(Property property);
     List<rentPayment> findByTenant(Tenant tenant);
}