package com.milkman.repository;

import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<MilkOrder, UUID> {

    public List<MilkOrder> findByMilkmanCustomer_Customer_Id(UUID customerId);
    public List<MilkOrder> findByMilkmanCustomer_Milkman_Id(UUID milkmanId);
    public List<MilkOrder> findByMilkmanCustomerAndOrderDate(MilkmanCustomer milkmanCustomerId, LocalDate orderDate);

    @Query("""
    SELECT new com.milkman.DTO.MilkOrderResponseDTO(
        mc.id,
        mc.customer.name,
        mo.note,
        COALESCE(mo.orderDate, CURRENT_DATE),
        SUM(COALESCE(mo.quantity, mc.customer.defaultMilkQty)),
        COALESCE(mo.status, 'PENDING'),
        mc.customer.address
    )
    FROM MilkmanCustomer mc
    LEFT JOIN MilkOrder mo ON mo.milkmanCustomer = mc
    WHERE
    mc.milkman.id = :milkmanId
    AND (mo.status = 'PENDING' OR mo.status IS NULL)
    AND (mo.orderDate = :orderDate OR mo.orderDate IS NULL)
    GROUP BY
    mc.id,
    mc.customer.name,
    mo.note,
    COALESCE(mo.orderDate, CURRENT_DATE),
    COALESCE(mo.status, 'PENDING'),
    mc.customer.address
    """)
    List<MilkOrderResponseDTO> getOrdersToBeDelivered(@Param("milkmanId") UUID milkmanId, @Param("orderDate") LocalDate orderDate);


    @Modifying
    @Query("UPDATE MilkOrder mo SET mo.status = :status WHERE mo.id = :orderId")
    public int updateOrderStatus(@Param("orderId") final UUID orderId, @Param("status") final String status);
}
