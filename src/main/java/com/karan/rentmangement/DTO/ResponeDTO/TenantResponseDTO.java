package com.karan.rentmangement.DTO.ResponeDTO;

import lombok.Data;

@Data
public class TenantResponseDTO {
    private int  id;
    private String name;
    private String email;
    private String phone;
    private long rent;
    private String landlordName;
    private String propertyAddress;
}
