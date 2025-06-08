package com.milkman.Adapter;

import com.milkman.DTO.MilkmanDTO;
import com.milkman.DTO.MyComplaintsResDTO;
import com.milkman.model.Complaint;
import org.springframework.stereotype.Component;

@Component
public class MyComplaintsResAdaptor implements DtoEntityAdapter<MyComplaintsResDTO, Complaint>{

    @Override
    public Complaint toEntity(MyComplaintsResDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public MyComplaintsResDTO toDto(Complaint complaint) {
        MyComplaintsResDTO dto = new MyComplaintsResDTO();
        dto.setId(complaint.getId());
        dto.setMilkmanId(complaint.getAssignedToMilkmanId().getId());
        dto.setMilkmanName(complaint.getAssignedToMilkmanId().getName());
        dto.setCategory(complaint.getCategory());
        dto.setStatus(complaint.getStatus());
        dto.setDescription(complaint.getDescription());
        dto.setComplaintDate(complaint.getCreatedAt().toLocalDate());
        return dto;
    }
}
