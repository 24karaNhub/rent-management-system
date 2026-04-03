package com.karan.rentmangement.controller;

import com.karan.rentmangement.service.rentPaymentService;
import com.karan.rentmangement.DTO.ResponseDTO.*;
import com.karan.rentmangement.DTO.RequestDTO.*;
import com.karan.rentmangement.DTO.RequestDTO.RentPaymentRequestDTO;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/rent-payments")
public class rentPaymentController {

    private final rentPaymentService rentpaymentService;

    public rentPaymentController(rentPaymentService rentpaymentService){
        this.rentpaymentService = rentpaymentService;
    }

    @PostMapping
    public ResponseEntity<RentPaymentResponseDTO> createPayment(
            @RequestBody @Valid RentPaymentRequestDTO dto){

        return ResponseEntity
                .status(201)
                .body(rentpaymentService.createRentPayment(dto));
    }

    @GetMapping
    public ResponseEntity<List<RentPaymentResponseDTO>> getallPayment(){
        return ResponseEntity.ok(rentpaymentService.getAllPayments());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRentPayment(@PathVariable int id){
        String message = rentpaymentService.deleteRentpayment(id);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentPaymentResponseDTO> getbyId(@PathVariable int id){
        return ResponseEntity.ok(rentpaymentService.getbyid(id));
    }
}