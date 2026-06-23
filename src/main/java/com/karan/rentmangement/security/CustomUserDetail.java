package com.karan.rentmangement.security;

import com.karan.rentmangement.model.Landlord;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetail implements UserDetails {

    private final Landlord landlord;

    public CustomUserDetail(Landlord landlord) {
        this.landlord = landlord;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_LANDLORD"));
    }

    @Override
    public String getPassword() {
        return landlord.getPassword();
    }

    @Override
    public String getUsername() {
        return landlord.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public Landlord getLandlord() {
        return landlord;
    }
}
