package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.Property;
import java.util.List;
@Repository
public interface TenantRepo extends JpaRepository<Tenant, Integer> {
List<Tenant> findByProperty(Property property);
    List<Tenant> findByLandlordId(int landlordId);
@Modifying
@Query("UPDATE Tenant t SET t.landlord = null WHERE t.landlord.id = :landlordId")
void unlinkLandlord(@Param("landlordId") int landlordId);
}