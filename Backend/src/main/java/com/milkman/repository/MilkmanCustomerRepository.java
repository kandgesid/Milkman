package com.milkman.repository;

import com.milkman.model.MilkmanCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MilkmanCustomerRepository extends JpaRepository<MilkmanCustomer, UUID> {
    List<MilkmanCustomer> findByMilkman_Id(UUID milkmanId);
    List<MilkmanCustomer> findByCustomer_Id(UUID customerId);
    Optional<MilkmanCustomer> findByMilkman_IdAndCustomer_Id(UUID milkmanId, UUID customerId);

    @Modifying
    @Query("UPDATE MilkmanCustomer mc SET mc.dueAmount = :dueAmount, mc.lastUpdated = :lastUpdated WHERE mc.id = :milkmanCustomerId")
    public int updateCustomerDueAmount(@Param("milkmanCustomerId") final UUID id,
                                       @Param("dueAmount") final double dueAmount,
                                       @Param("lastUpdated") final LocalDateTime lastUpdated);
}
