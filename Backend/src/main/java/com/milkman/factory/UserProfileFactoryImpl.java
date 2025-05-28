package com.milkman.factory;

import com.milkman.Adapter.DtoEntityAdapter;
import com.milkman.Bridge.ProfileCreator;
import com.milkman.Bridge.ProfileData;
import com.milkman.DTO.SignUpRequest;
import com.milkman.model.Customer;
import com.milkman.model.Milkman;
import com.milkman.model.User;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanRepository;
import com.milkman.types.Role;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class UserProfileFactoryImpl implements UserProfileFactory{
    private final CustomerRepository customerRepository;
    private final MilkmanRepository milkmanRepository;
    private final ProfileCreator milkmanCreator;
    private final ProfileCreator customerCreator;

    UserProfileFactoryImpl(CustomerRepository customerRepository, MilkmanRepository milkmanRepository, @Qualifier("milkmanProfileCreator") ProfileCreator milkmanCreator,
                           @Qualifier("customerProfileCreator") ProfileCreator customerCreator
    ){
        this.customerRepository = customerRepository;
        this.milkmanRepository = milkmanRepository;
        this.milkmanCreator   = milkmanCreator;
        this.customerCreator  = customerCreator;
    }
    @Override
    public void createUserProfile(SignUpRequest req, User savedUser) {
        Map<String,Object> fields = Map.of(
                "user",               savedUser,
                "role",               req.getRole(),
                "name",               req.getName(),
                "email",              req.getEmail(),
                "address",            req.getAddress(),
                "phoneNumber",        req.getPhoneNumber(),
                "familySize",         req.getNoOfFamilyMembers(),
                "dailyMilkRequired",  req.getDailyMilkRequired()
        );
        ProfileData data = new ProfileData(fields);
        if (Role.MILKMAN.toString().equalsIgnoreCase(req.getRole())) {
            milkmanCreator.createProfile(data);
        } else if (Role.CUSTOMER.toString().equalsIgnoreCase(req.getRole())) {
            customerCreator.createProfile(data);
        } else {
            throw new IllegalArgumentException("Invalid role: " + req.getRole());
        }
    }
}
