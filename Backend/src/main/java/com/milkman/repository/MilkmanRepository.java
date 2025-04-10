package com.milkman.repository;

import com.milkman.DTO.OrderDTO;
import com.milkman.model.Milkman;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface MilkmanRepository extends JpaRepository<Milkman, UUID> {
}
