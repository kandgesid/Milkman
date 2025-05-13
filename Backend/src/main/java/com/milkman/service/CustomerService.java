package com.milkman.service;

import com.milkman.DTO.CustomerInfoDTO;
import com.milkman.DTO.MilkmanInfoDTO;
import com.milkman.DTO.MyOrdersResDTO;
import com.milkman.DTO.UpdateMyOrderReqDTO;
import com.milkman.model.Customer;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    MilkmanCustomerRepository milkmanCustomerRepository;

    @Autowired
    OrderRepository orderRepository;

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

    public List<CustomerInfoDTO> getAllCustomersForMilkman(UUID milkmanId){
        List<MilkmanCustomer> result = milkmanCustomerRepository.findByMilkman_Id(milkmanId);
        return result.stream()
                .map(this::toDto)
                .toList();
    }

    public List<MyOrdersResDTO> getAllMyOrders(UUID customerId){
        List<MilkmanCustomer> links = milkmanCustomerRepository.findByCustomer_Id(customerId);
        return milkmanCustomerRepository.findByCustomer_Id(customerId).stream()
                .flatMap(mc -> orderRepository.findByMilkmanCustomer(mc).stream())
                .map(this::toMyOrderDto)
                .toList();
    }

    public MilkOrder updateMyOrder(UUID orderId, UpdateMyOrderReqDTO request){
        try{
            MilkOrder order =  orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            if(request.getRequestedQuantity() != order.getQuantity()){
                MilkmanCustomer mc = order.getMilkmanCustomer();
                double currQyt = order.getQuantity();
                double currAmt = order.getRate() * currQyt;
                double newQyt = request.getRequestedQuantity();
                double newAmt = order.getRate() * newQyt;
                double updatedAmt = mc.getDueAmount() - currAmt + newAmt;
                mc.setDueAmount(updatedAmt);
                mc.setLastUpdated(LocalDateTime.now());
                milkmanCustomerRepository.save(mc);
                order.setQuantity(newQyt);
                order.setAmount(newAmt);
            }
            if(!request.getNote().isEmpty()){
                order.setNote(request.getNote());
            }
            return orderRepository.save(order);
        }catch (RuntimeException e){
            throw new RuntimeException("Error while updating my order", e);
        }

    }

    public void cancelMyOrder(UUID orderId){
        try{
            MilkOrder order =  orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            MilkmanCustomer mc = order.getMilkmanCustomer();
            double currQyt = order.getQuantity();
            double currAmt = order.getRate() * currQyt;
            double updatedAmt = mc.getDueAmount() - currAmt;
            mc.setDueAmount(updatedAmt);
            mc.setLastUpdated(LocalDateTime.now());
            milkmanCustomerRepository.save(mc);
            orderRepository.delete(order);
        }catch (RuntimeException e){
            throw new RuntimeException("Error while deleting my order", e);
        }

    }

    private MyOrdersResDTO toMyOrderDto(MilkOrder order) {
        MyOrdersResDTO dto = new MyOrdersResDTO();
        dto.setOrderId(order.getId());
        dto.setMilkmanCustomerId(order.getMilkmanCustomer().getId());
        dto.setMilkmanName(order.getMilkmanCustomer().getMilkman().getName());
        dto.setOrderDate(order.getOrderDate());
        dto.setRate(order.getRate());
        dto.setAmount(order.getAmount());
        dto.setQuantity(order.getQuantity());
        dto.setStatus(order.getStatus());
        dto.setNote(order.getNote());
        return dto;
    }

    private CustomerInfoDTO toDto(MilkmanCustomer mc) {
        CustomerInfoDTO dto = new CustomerInfoDTO();
        dto.setId(mc.getCustomer().getId());
        dto.setName(mc.getCustomer().getName());
        dto.setEmail(mc.getCustomer().getEmail());
        dto.setPhoneNumber(mc.getCustomer().getPhoneNumber());
        dto.setAddress(mc.getCustomer().getAddress());
        dto.setFamilySize(mc.getCustomer().getFamilySize());
        dto.setDefaultMilkQty(mc.getCustomer().getDefaultMilkQty());
        dto.setMilkRate(mc.getMilkRate());
        dto.setDueAmount(mc.getDueAmount());
        return dto;
    }

}
