package com.karan.rentmangement.DTO.ResponeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponseDTO {
     private int id;
    private String type;
    private Long rent;
    private String city;
    private String address;

    private String landlordName; 
}
