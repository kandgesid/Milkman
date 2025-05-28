package com.milkman.Adapter;

import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.model.OrderHistory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.UUID;

@Component
public class HistoryResponseAdapter implements DtoEntityAdapter<MilkmanHistoryResponseDTO, OrderHistory>,
        RowMapper<MilkmanHistoryResponseDTO> {
    @Override
    public OrderHistory toEntity(MilkmanHistoryResponseDTO dto) {
        throw new UnsupportedOperationException("Not used");
    }

    @Override
    public MilkmanHistoryResponseDTO toDto(OrderHistory entity) {
        throw new UnsupportedOperationException("Not used");
    }

    @Override
    public MilkmanHistoryResponseDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        MilkmanHistoryResponseDTO dto = new MilkmanHistoryResponseDTO();
        dto.setOrder_id(UUID.fromString(rs.getString("order_id")));
        dto.setQuantity(rs.getDouble("quantity"));
        dto.setDue_amount(rs.getDouble("due_amount"));
        dto.setMilk_rate(rs.getDouble("milk_rate"));
        dto.setDelivery_status(rs.getString("delivery_status"));
        dto.setDelivery_date(rs.getObject("delivery_date", LocalDate.class));
        return dto;
    }
}
