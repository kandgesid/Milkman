package com.milkman.DAO;

import com.milkman.Adapter.OrderResponseAdapter;
import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.repository.JdbcRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class OrderServiceDAO {

    private final JdbcRepository jdbc;
    private final OrderResponseAdapter orderMapperAdapter;

    public OrderServiceDAO(JdbcRepository jdbc, OrderResponseAdapter orderMapperAdapter1) {

        this.jdbc = jdbc;
        this.orderMapperAdapter = orderMapperAdapter1;
    }

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
        return jdbc.query(sql, new Object[]{milkmanId}, orderMapperAdapter);
    }
}
