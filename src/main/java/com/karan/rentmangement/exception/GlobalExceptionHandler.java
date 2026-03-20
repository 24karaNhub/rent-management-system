package com.karan.rentmangement.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler  {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
       Map<String,String> errorMap =new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(error ->{
        String fieldName= ((FieldError) error).getField();
         String message =error.getDefaultMessage();
         errorMap.put(fieldName,message);
       }
       );
       return errorMap;
    }

    
}