package com.karan.rentmangement.DTO.RequestDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;
    private int totalRooms;
    private String type;
    @NotNull(message = "Rent is required")
    @Min(value = 0, message = "Rent amount must be greater than zero")
    private Long rent;
    private String city;
    @NotBlank(message = "Address is required")
    private String address;
    private int landlord_id;
    private List<RoomRequestDTO> rooms;
}
