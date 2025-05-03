package com.milkman.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class MilkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "milkman_customer_id", nullable = false)
    private MilkmanCustomer milkmanCustomer;

    private LocalDate orderDate;

    private double quantity;

    private double rate;

    private double amount;

    private String note;

    private String status;

    private LocalDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public MilkmanCustomer getMilkmanCustomer() {
        return milkmanCustomer;
    }

    public void setMilkmanCustomer(MilkmanCustomer milkmanCustomer) {
        this.milkmanCustomer = milkmanCustomer;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "MilkOrder{" +
                "id=" + id +
                ", milkmanCustomer=" + milkmanCustomer +
                ", orderDate=" + orderDate +
                ", quantity=" + quantity +
                ", rate=" + rate +
                ", amount=" + amount +
                ", note='" + note + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}