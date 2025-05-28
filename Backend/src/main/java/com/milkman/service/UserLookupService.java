package com.milkman.service;

import com.milkman.model.User;

import java.util.Optional;

public interface UserLookupService {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
}
