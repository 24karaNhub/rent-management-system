package com.karan.rentmangement.DTO.ResponseDTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TenantResponseDTO {
    private int id;
    private String name;
    private String email;
    private String phone;
    private long rent;
    private String landlordName;
    private String propertyAddress;
    private int property_id;
    private String status;
    private Integer roomId;
    private String roomNumber;
    private LocalDate dueDate;
}

