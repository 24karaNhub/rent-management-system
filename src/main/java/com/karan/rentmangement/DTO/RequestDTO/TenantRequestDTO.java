package com.karan.rentmangement.DTO.RequestDTO;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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

    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid phone number")
    private String phone;
    private int id;

    @Positive(message = "Rent amount must be greater than zero")
    private long rent;
    private String aadhar;
    private LocalDate moveInDate;
    private LocalDate moveOutDate;

    @NotNull(message = "Rent due date is required")
    private LocalDate dueDate;

    private int landlord_id;
    private int property_id;
    private String status;
    private Integer roomId;
}
