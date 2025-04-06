package com.milkman.controller;

import com.milkman.model.Customer;
import com.milkman.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @GetMapping("/")
    ResponseEntity<?> getAllCustomer(){
        try{
            List<Customer> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(customers);
        }catch (Exception ex){
            return ResponseEntity.internalServerError().body(ex);
        }
    }

    @GetMapping("/{id}")
    ResponseEntity<Customer> getCustomerById(@PathVariable UUID id){
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }
//    @GetMapping("/{id}")
//    ResponseEntity<?> getAllCustomersForMilkman(@PathVariable UUID id){
//        try {
//            List<Customer> customers = customerService.getAllCustomersForMilkman(id);
//            return ResponseEntity.ok((Customer) customers);
//        }catch (Exception ex){
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
//        }
//    }

}
