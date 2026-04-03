package com.karan.rentmangement.DTO.RequestDTO;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentPaymentRequestDTO {

    @NotNull(message = "Rent cannot be null")
    @Positive(message = "Rent must be greater than 0")
    private Long rent;

    @NotNull(message = "Month is required")
    private String month;

    @NotNull(message = "Date is required")
    private String date;

    @NotNull(message = "Status is required")
    private String status;      // "PAID", "PENDING", "OVERDUE"

    @NotNull(message = "Tenant is required")
    private int tenantId;

    @NotNull(message = "Property is required")
    private int propertyId;

    @NotNull(message = "Landlord is required")
    private int landlordId;

}
