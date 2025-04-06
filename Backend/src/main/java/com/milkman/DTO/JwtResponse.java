package com.milkman.DTO;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    public JwtResponse(String token, UUID id, String username, Collection<? extends GrantedAuthority> authorities) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.authorities = authorities;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; }

}
