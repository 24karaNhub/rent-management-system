package com.karan.rentmangement.DTO.RequestDTO;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantRequestDTO {
     @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email")
    private String email;

    @Size(min = 10, max = 10, message = "Phone must be 10 digits")
    private String phone;
    private int id;
    private long rent;
    private String aadhar;
    private LocalDate moveInDate;
    private LocalDate moveOutDate;
    private int landlord_id;
    private int property_id;
    private String status;
    private Integer roomId;
}
