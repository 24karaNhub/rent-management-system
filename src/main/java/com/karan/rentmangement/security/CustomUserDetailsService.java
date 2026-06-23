package com.karan.rentmangement.security;

import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.repository.LandlordRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final LandlordRepo landlordRepo;

    public CustomUserDetailsService(LandlordRepo landlordRepo) {
        this.landlordRepo = landlordRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Landlord landlord = landlordRepo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Landlord not found with email: " + username));
        return new CustomUserDetail(landlord);
    }
}
