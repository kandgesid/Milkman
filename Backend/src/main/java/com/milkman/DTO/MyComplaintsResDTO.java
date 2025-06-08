package com.milkman.DTO;

import java.time.LocalDate;
import java.util.UUID;

public class MyComplaintsResDTO {
    UUID id;
    UUID milkmanId;
    String MilkmanName;
    String description;
    String status;
    String category;
    LocalDate complaintDate;

    public LocalDate getComplaintDate() {
        return complaintDate;
    }

    public void setComplaintDate(LocalDate complaintDate) {
        this.complaintDate = complaintDate;
    }

    public String getMilkmanName() {
        return MilkmanName;
    }

    public void setMilkmanName(String milkmanName) {
        MilkmanName = milkmanName;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getMilkmanId() {
        return milkmanId;
    }

    public void setMilkmanId(UUID milkmanId) {
        this.milkmanId = milkmanId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
