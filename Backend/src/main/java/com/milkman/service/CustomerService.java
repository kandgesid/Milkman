package com.milkman.service;

import com.milkman.model.Customer;
import com.milkman.model.MilkmanCustomer;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    MilkmanCustomerRepository milkmanCustomerRepository;

    public List<Customer> getAllCustomers(){
        return customerRepository.findAll();
    }

    public Customer getCustomerById(final UUID customerId){
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<Customer> getCustomerByPhoneNumber(final String phone){
        return customerRepository.findByPhoneNumber(phone);
    }

    public List<Customer> getAllCustomersForMilkman(UUID milkmanId){
        List<MilkmanCustomer> result = milkmanCustomerRepository.findByMilkman_Id(milkmanId);
        return result.stream()
                    .map(MilkmanCustomer :: getCustomer)
                    .toList();
    }

}
