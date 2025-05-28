package com.milkman.Adapter;

import com.milkman.DTO.JwtResponse;
import com.milkman.model.User;
import com.milkman.security.UserDetailsImpl;
import org.springframework.stereotype.Component;

@Component
public class AuthResponseAdapter implements DtoEntityAdapter<JwtResponse, UserDetailsImpl> {

    @Override
    public JwtResponse toDto(UserDetailsImpl user) {
        // we only have id, username, authorities in JwtResponse
        // (assume you have a way to pull authorities from user.roles)
        return new JwtResponse(
                /* token =*/ null,
                user.getId(),
                user.getUsername(),
                user.getAuthorities()
        );
    }

    @Override
    public UserDetailsImpl toEntity(JwtResponse dto) {
        throw new UnsupportedOperationException("Not needed");
    }
}