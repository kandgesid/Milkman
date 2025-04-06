package com.milkman.repository;

import com.milkman.model.Customer;
import com.milkman.model.MilkmanCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    List<Customer> findByPhoneNumber(String phoneNumber);
}
