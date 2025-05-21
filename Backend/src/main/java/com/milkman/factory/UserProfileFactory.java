package com.milkman.factory;

import com.milkman.DTO.SignUpRequest;
import com.milkman.model.User;

public interface UserProfileFactory {
    void createUserProfile(SignUpRequest request, User savedUser);
}
