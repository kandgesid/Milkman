package com.milkman.repository;

import com.milkman.model.Milkman;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MilkmanRepository extends JpaRepository<Milkman, Long> {
}
