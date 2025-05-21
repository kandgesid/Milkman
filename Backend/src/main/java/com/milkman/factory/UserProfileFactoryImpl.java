package com.milkman.factory;

import com.milkman.DTO.SignUpRequest;
import com.milkman.model.Customer;
import com.milkman.model.Milkman;
import com.milkman.model.User;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanRepository;
import com.milkman.types.Role;
import org.springframework.stereotype.Component;

@Component
public class UserProfileFactoryImpl implements UserProfileFactory{
    private final CustomerRepository customerRepository;
    private final MilkmanRepository milkmanRepository;

    UserProfileFactoryImpl(CustomerRepository customerRepository, MilkmanRepository milkmanRepository){
        this.customerRepository = customerRepository;
        this.milkmanRepository = milkmanRepository;
    }
    @Override
    public void createUserProfile(SignUpRequest request, User savedUser) {
        if (Role.MILKMAN.toString().equalsIgnoreCase(request.getRole())) {
            Milkman milkman = new Milkman();
            milkman.setUser(savedUser);
            milkman.setName(request.getName());
            milkman.setEmail(request.getEmail());
            milkman.setAddress(request.getAddress());
            milkman.setPhoneNumber(request.getPhoneNumber());
            milkmanRepository.save(milkman);
        } else if (Role.CUSTOMER.toString().equalsIgnoreCase(request.getRole())) {
            Customer customer = new Customer();
            customer.setUser(savedUser);
            customer.setName(request.getName());
            customer.setEmail(request.getEmail());
            customer.setAddress(request.getAddress());
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setFamilySize(request.getNoOfFamilyMembers());
            customer.setDefaultMilkQty(request.getDailyMilkRequired());
            customerRepository.save(customer);
        } else {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }
    }
}
