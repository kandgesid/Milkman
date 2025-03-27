package com.milkman.repository;

import com.milkman.model.MilkmanCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MilkmanCustomerRepository extends JpaRepository<MilkmanCustomer, UUID> {
    List<MilkmanCustomer> findByMilkman_Id(UUID milkmanId);
}
