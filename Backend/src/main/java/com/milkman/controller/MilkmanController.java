package com.milkman.controller;

import com.milkman.DTO.AddNewCustomerDTO;
import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.model.Customer;
import com.milkman.model.Milkman;
import com.milkman.model.MilkmanCustomer;
import com.milkman.service.CustomerService;
import com.milkman.service.MilkmanService;
import com.milkman.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/milkman")
@CrossOrigin(origins = "*")
public class MilkmanController {
    
    @Autowired
    private MilkmanService milkmanService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public List<Milkman> getAllMilkman() {
        return milkmanService.getAllMilkman();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Milkman> getMilkmanById(@PathVariable UUID id) {
        try{
            Milkman milkman = milkmanService.getMilkmanById(id);
            return new ResponseEntity<>(milkman, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/myCustomers/{id}")
    ResponseEntity<?> getAllCustomersForMilkman(@PathVariable UUID id){
        try {
            List<Customer> customers = customerService.getAllCustomersForMilkman(id);
            return ResponseEntity.ok(customers);
        }catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @GetMapping("/{milkmanId}/orders/today")
    ResponseEntity<?> getTodaysOrdersForMilkman(@PathVariable("milkmanId") UUID id){
       try{
           List<MilkOrderResponseDTO> orders = orderService.getTodaysOrdersForMilkman(id);
           return ResponseEntity.status(HttpStatus.OK).body(orders);
       }catch (Exception ex){
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
       }
    }
    
    @PostMapping
    public Milkman createMilkman(@RequestBody Milkman user) {
        return milkmanService.createMilkman(user);
    }

    @PostMapping("/addNewCustomer")
    public ResponseEntity<?> addNewCustomer(@RequestBody AddNewCustomerDTO userDetails) {
        System.out.println(userDetails.getMilkManId());
        try {
            List<Customer> customerList = customerService.getCustomerByPhoneNumber(userDetails.getPhoneNumber());
            if(customerList.isEmpty()){
                return ResponseEntity.notFound().build();
            }
            Customer customer = customerList.get(0);
            MilkmanCustomer milkmanCustomer = milkmanService.addCustomerForMilkman(customer, userDetails);
            return ResponseEntity.ok(milkmanCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }

    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Milkman> updateMilkman(@PathVariable UUID id, @RequestBody Milkman userDetails) {
        try {
            Milkman updatedMilkman = milkmanService.updateMilkman(id, userDetails);
            return ResponseEntity.ok(updatedMilkman);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMilkman(@PathVariable UUID id) {
        milkmanService.deleteMilkman(id);
        return ResponseEntity.ok().build();
    }
} 