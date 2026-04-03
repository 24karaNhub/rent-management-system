package com.karan.rentmangement.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.karan.rentmangement.model.Landlord;
import java.util.Optional;

@Repository
public interface LandlordRepo  extends JpaRepository<Landlord, Integer>{
    Optional<Landlord> findByEmail(String email);
}