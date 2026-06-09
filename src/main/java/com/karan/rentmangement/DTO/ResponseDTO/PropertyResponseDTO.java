package com.karan.rentmangement.DTO.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponseDTO {
    private int id;
    private String name;
    private String type;
    private Long rent;
    private String city;
    private String address;
    private int totalRooms;
    private String landlordName;
    private int tennatCount;
    private List<RoomResponseDTO> rooms;
}

