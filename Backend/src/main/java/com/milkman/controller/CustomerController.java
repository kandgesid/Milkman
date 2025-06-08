package com.milkman.controller;

import com.milkman.DTO.*;
import com.milkman.model.Complaint;
import com.milkman.model.Customer;
import com.milkman.model.MilkOrder;
import com.milkman.service.ComplaintService;
import com.milkman.service.CustomerService;
import com.milkman.service.MilkmanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @Autowired
    private MilkmanService milkmanService;
    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/")
    ResponseEntity<?> getAllCustomer(){

            List<Customer> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(customers);

    }

    @GetMapping("/{id}")
    ResponseEntity<CustomerDTO> getCustomerById(@PathVariable UUID id){
        CustomerDTO customer = customerService.getCustomerById(id);

        return ResponseEntity.ok(customer);
    }

    @GetMapping("/myMilkmans/{id}")
    ResponseEntity<?> getAllMilkmanForCustomer(@PathVariable UUID id){
        List<MilkmanInfoDTO> res = milkmanService.getAllMilkmanForCustomer(id);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/myComplaints/{id}")
    ResponseEntity<?> getMyComplaints(@PathVariable UUID id){
        List<MyComplaintsResDTO> res = complaintService.getComplaintsByCustomerId(id);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}/myOrders/")
    ResponseEntity<?> getMyOrders(@PathVariable UUID id){
        List<MyOrdersResDTO> myOrders = customerService.getAllMyOrders(id);
        return ResponseEntity.ok(myOrders);
    }

    @PostMapping ("/updateMyOrder/{id}")
    ResponseEntity<?> updateMyOrders(@PathVariable UUID id, @RequestBody UpdateMyOrderReqDTO request){
        try {
            MilkOrder order = customerService.updateMyOrder(id, request);
            return ResponseEntity.ok(order.getId());
        }catch (Exception ex){
            return ResponseEntity.internalServerError().body(ex);
        }
    }

    @PostMapping ("/updateCustomer/{id}")
    ResponseEntity<?> updateCustomer(@PathVariable UUID id, @RequestBody CustomerDTO request){
        try {
            Customer customer = customerService.updateCustomer(id, request);
            return ResponseEntity.ok(customer.getId());
        }catch (Exception ex){
            return ResponseEntity.internalServerError().body(ex);
        }
    }

    @PostMapping("/cancelMyOrder/{id}")
    ResponseEntity<?> cancelMyOrder(@PathVariable UUID id){
        try {
            System.out.println( "CancelMyOrder: " + id);
            customerService.cancelMyOrder(id);
            return ResponseEntity.ok(HttpStatus.OK);
        }catch (Exception ex){
            return ResponseEntity.internalServerError().body(ex);
        }
    }

}
