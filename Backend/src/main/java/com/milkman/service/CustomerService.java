package com.milkman.service;


import com.milkman.Adapter.CustomerDTOResponseAdaptor;
import com.milkman.Adapter.DtoEntityAdapter;
import com.milkman.Adapter.MyOrderResAdapter;
import com.milkman.Billing.Decorator.CostCalculator;
import com.milkman.DTO.CustomerDTO;
import com.milkman.DTO.CustomerInfoDTO;
import com.milkman.DTO.MyOrdersResDTO;
import com.milkman.DTO.UpdateMyOrderReqDTO;
import com.milkman.exception.CustomerNotFoundException;
import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.model.Customer;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderRepository;
import com.milkman.types.ErrorType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    private final DtoEntityAdapter<CustomerDTO, Customer> customerDTOResponseAdaptor;
    private final DtoEntityAdapter<MyOrdersResDTO, MilkOrder> myOrdersResDTOResponseAdaptor;
    private final DtoEntityAdapter<CustomerInfoDTO, MilkmanCustomer> customerInfoDTOResponseAdaptor;

    private final CostCalculator costCalculator;



    public CustomerService(CustomerDTOResponseAdaptor customerDTOResponseAdaptor,
                           DtoEntityAdapter<MyOrdersResDTO, MilkOrder> myOrderResponseAdaptor,
                           DtoEntityAdapter<CustomerInfoDTO, MilkmanCustomer> customerInfoDTOResponseAdaptor, CostCalculator costCalculator) {
        this.customerDTOResponseAdaptor = customerDTOResponseAdaptor;
        this.myOrdersResDTOResponseAdaptor = myOrderResponseAdaptor;
        this.customerInfoDTOResponseAdaptor = customerInfoDTOResponseAdaptor;
        this.costCalculator = costCalculator;
    }

    public List<Customer> getAllCustomers(){
        return customerRepository.findAll();
    }


    public CustomerDTO getCustomerById(final UUID customerId){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(customerId));
        return customerDTOResponseAdaptor.toDto(customer);
    }

    public List<Customer> getCustomerByPhoneNumber(final String phone){
        return customerRepository.findByPhoneNumber(phone);
    }

    public List<CustomerInfoDTO> getAllCustomersForMilkman(UUID milkmanId){
        try {
            List<MilkmanCustomer> result = milkmanCustomerRepository.findByMilkman_Id(milkmanId);
            return result.stream().map(customerInfoDTOResponseAdaptor::toDto).toList();
        } catch (Exception ex) {
            throw new DetailedExceptionBuilder()
                    .withErrorCode("CUSTOMER-MILKMAN-500")
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withType(ErrorType.SYSTEM)
                    .withDetails(ex.getMessage())
                    .build();
        }
    }

    public List<MyOrdersResDTO> getAllMyOrders(UUID customerId){
        List<MilkmanCustomer> links = milkmanCustomerRepository.findByCustomer_Id(customerId);
        return milkmanCustomerRepository.findByCustomer_Id(customerId).stream()
                .flatMap(mc -> orderRepository.findByMilkmanCustomer(mc).stream())
                .map(myOrdersResDTOResponseAdaptor::toDto)
                .toList();
    }

    public MilkOrder updateMyOrder(UUID orderId, UpdateMyOrderReqDTO request){
        try{
            MilkOrder order =  orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            if(request.getRequestedQuantity() != order.getQuantity()){
                MilkmanCustomer mc = order.getMilkmanCustomer();
                double currAmt = order.getAmount();
                double newQyt = request.getRequestedQuantity();
                double newAmt = costCalculator.calculateCost(newQyt, order.getRate());
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

    public Customer updateCustomer(UUID customerId, CustomerDTO request){
        try{
            Customer customer =  customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
            customer.setName(request.getName());
            customer.setEmail(request.getEmail());
            customer.setAddress(request.getAddress());
            customer.setFamilySize(request.getFamilySize());
            customer.setDefaultMilkQty(request.getDefaultMilkQty());
            return customerRepository.save(customer);
        }catch (RuntimeException e){
            throw new RuntimeException("Error while updating customer", e);
        }

    }

    public void cancelMyOrder(UUID orderId){
        try{
            MilkOrder order =  orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            MilkmanCustomer mc = order.getMilkmanCustomer();
            double currAmt = order.getAmount();
            double updatedAmt = mc.getDueAmount() - currAmt;
            mc.setDueAmount(updatedAmt);
            mc.setLastUpdated(LocalDateTime.now());
            milkmanCustomerRepository.save(mc);
            orderRepository.delete(order);
        }catch (RuntimeException e){
            throw new RuntimeException("Error while deleting my order", e);
        }

    }

}
