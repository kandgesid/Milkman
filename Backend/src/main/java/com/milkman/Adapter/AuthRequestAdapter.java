package com.milkman.Adapter;

import com.milkman.DTO.SignUpRequest;
import com.milkman.model.User;
import com.milkman.types.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthRequestAdapter implements DtoEntityAdapter<SignUpRequest, User>{
    private final PasswordEncoder encoder;

    public AuthRequestAdapter(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    @Override
    public User toEntity(SignUpRequest dto) {
        User user = new User();
        user.setUsername(dto.getPhoneNumber());
        user.setPassword(encoder.encode(dto.getPassword()));
        // assume Role.fromString maps "MILKMAN"/"CUSTOMER"
        user.addRole(Role.fromString(dto.getRole()));
        return user;
    }

    @Override
    public SignUpRequest toDto(User entity) {
        throw new UnsupportedOperationException("Not needed for signup");
    }
}
