package com.milkman.Adapter;

import com.milkman.DTO.CustomerDTO;
import com.milkman.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerDTOResponseAdaptor implements DtoEntityAdapter<CustomerDTO, Customer>{
    @Override
    public Customer toEntity(CustomerDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public CustomerDTO toDto(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setFamilySize(customer.getFamilySize());
        dto.setDefaultMilkQty(customer.getDefaultMilkQty());
        return dto;
    }
}
