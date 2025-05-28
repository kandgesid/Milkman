package com.milkman.Adapter;

import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.model.Customer;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.UUID;

@Component
public class OrderResponseAdapter implements DtoEntityAdapter<MilkOrderResponseDTO, MilkOrder>,
        RowMapper<MilkOrderResponseDTO> {

    @Override
    public MilkOrderResponseDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        MilkOrder order = new MilkOrder();
        order.setId(UUID.fromString(rs.getString("order_id")));
        order.setOrderDate(rs.getObject("order_date", LocalDate.class));
        order.setQuantity(rs.getDouble("quantity"));
        order.setStatus(rs.getString("status"));
        order.setNote(rs.getString("note"));

        // fake up the MilkmanCustomer relationship
        var mc = new MilkmanCustomer();
        mc.setId(UUID.fromString(rs.getString("milkman_customer_id")));
        var cust = new Customer();
        cust.setName(rs.getString("customer_name"));
        cust.setAddress(rs.getString("address"));
        mc.setCustomer(cust);
        order.setMilkmanCustomer(mc);

        // now reuse your toDto logic
        return toDto(order);
    }

    @Override
    public MilkOrder toEntity(MilkOrderResponseDTO dto) {
        throw new UnsupportedOperationException("Not needed");
    }

    @Override
    public MilkOrderResponseDTO toDto(MilkOrder order) {
        MilkOrderResponseDTO dto = new MilkOrderResponseDTO();
        dto.setOrderId(order.getId());
        dto.setMilkmanCustomerId(order.getMilkmanCustomer().getId());
        dto.setCustomerName(order.getMilkmanCustomer().getCustomer().getName());
        dto.setCustomerAddress(order.getMilkmanCustomer().getCustomer().getAddress());
        dto.setOrderDate(order.getOrderDate());
        dto.setMilkQuantity(order.getQuantity());
        dto.setStatus(order.getStatus());
        dto.setNote(order.getNote());
        return dto;
    }
}
