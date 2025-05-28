package com.milkman.Bridge;

public abstract class ProfileCreator {
    protected final ProfilePersistence persistence;

    protected ProfileCreator(ProfilePersistence persistence) {
        this.persistence = persistence;
    }

    /** Build & persist a user profile from ProfileData. */
    public abstract void createProfile(ProfileData data);
}
