package com.milkman.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.UUID;

public class ComplaintRequestDTO {

    private UUID milkmanId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID customerId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String description;
    private String category;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
