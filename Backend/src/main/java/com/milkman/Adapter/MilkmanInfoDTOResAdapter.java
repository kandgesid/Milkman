package com.milkman.Adapter;

import com.milkman.DTO.MilkmanInfoDTO;
import com.milkman.model.MilkmanCustomer;
import org.springframework.stereotype.Component;

@Component
public class MilkmanInfoDTOResAdapter implements DtoEntityAdapter<MilkmanInfoDTO, MilkmanCustomer>{

    @Override
    public MilkmanCustomer toEntity(MilkmanInfoDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public MilkmanInfoDTO toDto(MilkmanCustomer mc) {
        MilkmanInfoDTO dto = new MilkmanInfoDTO();
        dto.setId(mc.getMilkman().getId());
        dto.setName(mc.getMilkman().getName());
        dto.setEmail(mc.getMilkman().getEmail());
        dto.setPhoneNumber(mc.getMilkman().getPhoneNumber());
        dto.setAddress(mc.getMilkman().getAddress());
        dto.setMilkRate(mc.getMilkRate());
        dto.setDueAmount(mc.getDueAmount());
        return dto;
    }
}
