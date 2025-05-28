package com.milkman.Adapter;

import com.milkman.DTO.CustomerInfoDTO;
import com.milkman.model.MilkmanCustomer;
import org.springframework.stereotype.Component;

@Component
public class CustomerInfoResAdapter implements DtoEntityAdapter<CustomerInfoDTO, MilkmanCustomer>{
    @Override
    public MilkmanCustomer toEntity(CustomerInfoDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public CustomerInfoDTO toDto(MilkmanCustomer mc) {
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
