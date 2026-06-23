package com.karan.rentmangement;

import com.karan.rentmangement.DTO.RequestDTO.LoginRequest;
import com.karan.rentmangement.DTO.RequestDTO.SignupRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private LandlordRepo landlordRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testSignupAndLoginWithBCrypt() {
        String email = "bcrypt.test@gmail.com";
        String rawPassword = "securePassword123";

        SignupRequestDTO signupDto = new SignupRequestDTO();
        signupDto.setName("BCrypt Test");
        signupDto.setEmail(email);
        signupDto.setPhone("9999999999");
        signupDto.setPassword(rawPassword);

        // 1. Signup
        LandlordResponseDTO signupResponse = authService.signup(signupDto);
        assertNotNull(signupResponse);
        assertEquals(email, signupResponse.getEmail());
        assertNotNull(signupResponse.getToken()); // Assert token generated on signup

        // Verify database state: password must be encrypted
        Landlord landlord = landlordRepo.findByEmail(email).orElse(null);
        assertNotNull(landlord);
        assertNotEquals(rawPassword, landlord.getPassword());
        assertTrue(passwordEncoder.matches(rawPassword, landlord.getPassword()));
        assertTrue(landlord.getPassword().startsWith("$2a$")); // BCrypt prefix

        // 2. Successful Login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(rawPassword);

        LandlordResponseDTO loginResponse = authService.login(loginRequest);
        assertNotNull(loginResponse);
        assertEquals(signupResponse.getId(), loginResponse.getId());
        assertNotNull(loginResponse.getToken()); // Assert token generated on login

        // 3. Failed Login with invalid password
        LoginRequest wrongLoginRequest = new LoginRequest();
        wrongLoginRequest.setEmail(email);
        wrongLoginRequest.setPassword("wrongPassword");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(wrongLoginRequest);
        });
        assertEquals("Invalid password", exception.getMessage());
    }

    @Autowired
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Test
    public void testCustomUserDetailsService() {
        String email = "userdetails.test@gmail.com";
        SignupRequestDTO signupDto = new SignupRequestDTO();
        signupDto.setName("Details Test");
        signupDto.setEmail(email);
        signupDto.setPhone("8888888888");
        signupDto.setPassword("password123");

        authService.signup(signupDto);

        // Load details via user details service
        org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_LANDLORD")));
        
        // Assert fail when user not found
        assertThrows(org.springframework.security.core.userdetails.UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("nonexistent@gmail.com");
        });
    }
}
