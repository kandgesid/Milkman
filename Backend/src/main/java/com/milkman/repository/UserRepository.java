package com.milkman.repository;

import com.milkman.model.User;
import com.milkman.service.UserLookupService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, UserLookupService {

    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
} 