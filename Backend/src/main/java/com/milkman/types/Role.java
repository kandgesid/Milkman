package com.milkman.types;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {

    MILKMAN,
    CUSTOMER,
    ;

    @Override
    public String getAuthority() {
        return name();
    }

    public static Role fromString(String input) {
        return switch (input.trim().toLowerCase()) {
            case "customer" -> CUSTOMER;
            case "milkman" -> MILKMAN;
            default -> throw new IllegalArgumentException("Invalid role: " + input);
        };
    }
}
