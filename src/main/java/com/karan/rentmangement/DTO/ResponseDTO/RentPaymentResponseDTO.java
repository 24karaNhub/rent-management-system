package com.karan.rentmangement.DTO.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RentPaymentResponseDTO {
    private int id;
    private long amount;
    private String month;
    private String status;
    private String date;
    private String landlordName;
    private String tenantName;
    private String propertyName;

    
}
