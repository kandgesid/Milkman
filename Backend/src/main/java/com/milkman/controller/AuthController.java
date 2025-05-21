package com.milkman.controller;

import com.milkman.DTO.JwtResponse;
import com.milkman.DTO.LoginRequest;
import com.milkman.DTO.SignUpRequest;
import com.milkman.model.User;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanRepository;
import com.milkman.repository.UserRepository;
import com.milkman.security.JwtProvider;
import com.milkman.security.UserDetailsImpl;
import com.milkman.types.Role;
import com.milkman.factory.UserProfileFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileFactory userProfileFactory;

    @Autowired
    private MilkmanRepository milkmanRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody SignUpRequest signUpRequest) {
        if(userRepository.existsByUsername(signUpRequest.getPhoneNumber())){
            return ResponseEntity.badRequest().body("Error: Phone number is already taken! User already exists!");
        }

        // Create new user account
        User user = new User();
        user.setUsername(signUpRequest.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.addRole(Role.fromString(signUpRequest.getRole()));
        userRepository.save(user);

        userProfileFactory.createUserProfile(signUpRequest, user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getAuthorities()));
    }
}
