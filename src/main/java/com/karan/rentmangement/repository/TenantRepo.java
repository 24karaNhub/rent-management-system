package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.karan.rentmangement.model.Tenant;
@Repository
public interface TenantRepo extends JpaRepository<Tenant, Integer> {

    
}