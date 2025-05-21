package com.milkman.controller;

import com.milkman.DTO.JwtResponse;
import com.milkman.DTO.LoginRequest;
import com.milkman.DTO.SignUpRequest;
import com.milkman.service.AuthFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody SignUpRequest signUpRequest) {
        String message = authFacade.registerUser(signUpRequest);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        JwtResponse response = authFacade.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}
