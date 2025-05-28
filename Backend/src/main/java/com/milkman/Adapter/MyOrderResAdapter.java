package com.milkman.Adapter;

import com.milkman.DTO.MyOrdersResDTO;
import com.milkman.model.MilkOrder;
import org.springframework.stereotype.Component;

@Component
public class MyOrderResAdapter implements DtoEntityAdapter<MyOrdersResDTO, MilkOrder>{
    @Override
    public MilkOrder toEntity(MyOrdersResDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public MyOrdersResDTO toDto(MilkOrder order) {
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
}
