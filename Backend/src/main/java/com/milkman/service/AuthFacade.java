package com.milkman.service;

import com.milkman.DTO.JwtResponse;
import com.milkman.DTO.LoginRequest;
import com.milkman.DTO.SignUpRequest;
import com.milkman.exception.UserAlreadyExistsException;
import com.milkman.model.User;
import com.milkman.repository.UserRepository;
import com.milkman.security.JwtProvider;
import com.milkman.security.UserDetailsImpl;
import com.milkman.types.Role;
import com.milkman.factory.UserProfileFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthFacade {

    private final AuthenticationManager authenticationManager;
    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtProvider           jwtProvider;
    private final UserProfileFactory    userProfileFactory;

    public AuthFacade(AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtProvider jwtProvider,
                      UserProfileFactory userProfileFactory) {
        this.authenticationManager = authenticationManager;
        this.userRepository        = userRepository;
        this.passwordEncoder       = passwordEncoder;
        this.jwtProvider           = jwtProvider;
        this.userProfileFactory    = userProfileFactory;
    }

    public String registerUser(SignUpRequest req) {
        String phone = req.getPhoneNumber();
        if (!StringUtils.hasText(phone) || userRepository.existsByUsername(phone)) {
            throw new UserAlreadyExistsException(phone);
        }

        User user = new User();
        user.setUsername(phone);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.addRole(Role.fromString(req.getRole()));
        userRepository.save(user);

        // delegate profile‐creation (Milkman vs Customer) to factory
        userProfileFactory.createUserProfile(req, user);

        return "User registered successfully";
    }

    public JwtResponse loginUser(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getUsername(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = jwtProvider.generateToken(auth);
        UserDetailsImpl ud = (UserDetailsImpl) auth.getPrincipal();
        return new JwtResponse(jwt, ud.getId(), ud.getUsername(), ud.getAuthorities());
    }
}
