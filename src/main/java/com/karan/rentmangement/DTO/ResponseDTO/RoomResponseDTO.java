package com.karan.rentmangement.DTO.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDTO {
    private int id;
    private String roomNumber;
    private Long rent;
    private String status;
    private Integer tenantId;
    private String tenantName;
}
