package com.milkman.Bridge;

import org.springframework.stereotype.Component;

@Component("customerProfileCreator")
public class CustomerProfileCreator extends ProfileCreator {
    public CustomerProfileCreator(ProfilePersistence persistence) {
        super(persistence);
    }

    @Override
    public void createProfile(ProfileData data) {
        persistence.saveProfile(data);
    }
}
