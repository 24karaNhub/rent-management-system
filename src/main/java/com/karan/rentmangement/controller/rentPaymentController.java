package com.karan.rentmangement.controller;

import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.service.rentPaymentService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/rent-payment")
public class rentPaymentController {

    private final rentPaymentService rentpaymentService;

    public rentPaymentController(rentPaymentService rentpaymentService){
        this.rentpaymentService = rentpaymentService;
    }

    @PostMapping
    public rentPayment createPayment(@RequestBody @Valid rentPayment payment){
        return rentpaymentService.createRentPayment(payment);
    }
    @GetMapping
    public List<rentPayment> getallPayment(){
        return rentpaymentService.getAllPayments();
    }
    @DeleteMapping
    public String deleteRentPayment(@PathVariable int id ){
        rentpaymentService.deleteRentpayment(id);
        return "payement deleted ";
    }
    @GetMapping("/{id}")
    public rentPayment getbyId(@PathVariable int id ){
        return rentpaymentService.getbyid(id);
    }
}