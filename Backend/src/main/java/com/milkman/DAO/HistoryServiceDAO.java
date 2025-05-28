package com.milkman.DAO;

import com.milkman.Adapter.HistoryResponseAdapter;
import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.repository.JdbcRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public class HistoryServiceDAO {

    private final JdbcRepository jdbc;
    private final HistoryResponseAdapter historyResponseAdapter;

    public HistoryServiceDAO(JdbcRepository jdbc, HistoryResponseAdapter historyResponseAdapter) {
        this.jdbc = jdbc;
        this.historyResponseAdapter = historyResponseAdapter;
    }

    public List<MilkmanHistoryResponseDTO> getHistoryForGivenMilkmanAndCustomer(UUID milkmanId, UUID customerId, LocalDate from, LocalDate to) {
        String sql = """
                select
                    mo.id as order_id,
                    mo.amount as due_amount,
                    mo.quantity as quantity,
                    mo.rate as milk_rate,
                    oh.status as delivery_status,
                    oh.delivery_date as delivery_date
                from order_history oh
                    join milk_order mo
                    on oh.order_id = mo.id
                    join milkman_customer mc
                    on mo.milkman_customer_id = mc.id
                where mc.milkman_id = ?
                    and mc.customer_id = ?
                    and oh.delivery_date >= ? and oh.delivery_date < ?;
            """;
        return jdbc.query(sql, new Object[]{milkmanId, customerId, from, to}, historyResponseAdapter);
    }
}
