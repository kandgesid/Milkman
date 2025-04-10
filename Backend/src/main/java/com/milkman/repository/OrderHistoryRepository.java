package com.milkman.repository;

import com.milkman.model.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, UUID> {
}
