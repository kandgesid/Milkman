package com.milkman.Adapter;

import com.milkman.DTO.MilkmanDTO;
import com.milkman.model.Milkman;
import org.springframework.stereotype.Component;

@Component
public class MilkmanDtoResAdapter implements DtoEntityAdapter<MilkmanDTO, Milkman>{
    @Override
    public Milkman toEntity(MilkmanDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public MilkmanDTO toDto(Milkman milkman) {
        MilkmanDTO dto = new MilkmanDTO();
        dto.setId(milkman.getId());
        dto.setName(milkman.getName());
        dto.setEmail(milkman.getEmail());
        dto.setAddress(milkman.getAddress());
        dto.setPhoneNumber(milkman.getPhoneNumber());
        return dto;
    }
}
