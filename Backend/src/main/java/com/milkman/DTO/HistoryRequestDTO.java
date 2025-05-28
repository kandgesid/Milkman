package com.milkman.DTO;

import java.util.UUID;

public class HistoryRequestDTO {
    private UUID customerId;
    private UUID milkmanId;
    private String strategy; // e.g., "MONTHLY" or "CUSTOM"
    private String fromDate;
    private String toDate;

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

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }
}
