package com.milkman.DAO;

import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.repository.JdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public class OrderServiceDAO {

    @Autowired
    private JdbcRepository jdbc;

    private final RowMapper<MilkOrderResponseDTO> orderMapper = new RowMapper<>() {
        @Override
        public MilkOrderResponseDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            MilkOrderResponseDTO o = new MilkOrderResponseDTO();
            o.setMilkmanCustomerId( UUID.fromString(rs.getString("milkman_customer_id")) );
            o.setOrderDate( rs.getObject("order_date", LocalDate.class) );
            o.setMilkQuantity( rs.getDouble("quantity") );
            o.setNote( rs.getString("note") );
            o.setStatus( rs.getString("status") );
            o.setCustomerAddress(rs.getString("address"));
            o.setCustomerName(rs.getString("customer_name"));
            o.setOrderId(UUID.fromString(rs.getString("order_id")));
            return o;
        }
    };

    public List<MilkOrderResponseDTO> getTodaysOrdersByMilkman(UUID milkmanId) {
        String sql = """
                select
                      mo.id 						 as order_id,
                      mc.id                          AS milkman_customer_id,
                      c.name                         AS customer_name,
                      mo.note                        AS note,
                      mo.order_date                  AS order_date,
                      mo.quantity                    AS quantity,
                      mo.status                      AS status,
                      c.address                      AS address
                    FROM milkman_customer mc
                    JOIN customer c
                      ON c.id = mc.customer_id
                    JOIN milk_order mo
                      ON mo.milkman_customer_id = mc.id
                      AND mo.status    = 'PENDING'
                      AND DATE(mo.order_date) = CURRENT_DATE
                    WHERE mc.milkman_id = ?
            """;
        return jdbc.query(sql, new Object[]{milkmanId}, orderMapper);
    }
}
