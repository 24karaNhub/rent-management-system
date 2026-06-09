package com.karan.rentmangement.DTO.RequestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyRequestDTO {
    private String name;
    private int totalRooms;
    private String type;
    private Long rent;
    private String city;
    private String address;
    private int landlord_id;
    private List<RoomRequestDTO> rooms;
}
