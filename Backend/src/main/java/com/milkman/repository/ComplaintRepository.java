package com.milkman.repository;

import com.milkman.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
}
