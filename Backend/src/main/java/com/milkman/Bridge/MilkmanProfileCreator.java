package com.milkman.Bridge;

import org.springframework.stereotype.Component;

@Component("milkmanProfileCreator")
public class MilkmanProfileCreator extends ProfileCreator {
    public MilkmanProfileCreator(ProfilePersistence persistence) {
        super(persistence);
    }

    @Override
    public void createProfile(ProfileData data) {
        persistence.saveProfile(data);
    }
}
