package com.karan.rentmangement.controller;

import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.service.rentPaymentService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rent-payment")
public class rentPaymentController {

    private final rentPaymentService rentpaymentService;

    public rentPaymentController(rentPaymentService rentpaymentService){
        this.rentpaymentService = rentpaymentService;
    }

    @PostMapping
    public rentPayment createPayment(@RequestBody rentPayment payment){
        return rentpaymentService.createRentPayment(payment);
    }
}