package com.karan.rentmangement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.karan.rentmangement.model.Room;
import com.karan.rentmangement.model.Property;
import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, Integer> {
    List<Room> findByProperty(Property property);
}
