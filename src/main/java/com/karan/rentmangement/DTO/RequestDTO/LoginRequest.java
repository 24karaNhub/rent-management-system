package com.karan.rentmangement.DTO.RequestDTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }  // ✅ this MUST exist
    public void setPassword(String password) { this.password = password; }
}