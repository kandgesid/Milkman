package com.milkman.DTO;

import java.time.LocalDate;
import java.util.UUID;

public class MilkOrderRequestDTO {
    private UUID customerId;
    private UUID milkmanId;
    private double requestedQuantity;
    private LocalDate orderDate;

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public UUID getMilkmanId() {
        return milkmanId;
    }

    public void setMilkmanId(UUID milkmanId) {
        this.milkmanId = milkmanId;
    }

    public double getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(double requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }
}
