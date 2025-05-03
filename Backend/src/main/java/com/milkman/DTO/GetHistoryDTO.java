package com.milkman.DTO;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

public class GetHistoryDTO {
    LocalDateTime toDate;
    LocalDateTime fromDate;
    UUID customerId;
    UUID milkmanId;

    public UUID getMilkmanId() {
        return milkmanId;
    }

    public void setMilkmanId(UUID milkmanId) {
        this.milkmanId = milkmanId;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public LocalDateTime getToDate() {
        return toDate;
    }

    public void setToDate(LocalDateTime toDate) {
        this.toDate = toDate;
    }

    public LocalDateTime getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDateTime fromDate) {
        this.fromDate = fromDate;
    }
}
