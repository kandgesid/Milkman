package com.milkman.DTO;

import java.util.UUID;

public class AddNewCustomerDTO {
    String phoneNumber;
    String rate;
    UUID milkManId;

    public AddNewCustomerDTO(String phoneNumber, String rate, UUID milkManId) {
        this.phoneNumber = phoneNumber;
        this.rate = rate;
        this.milkManId = milkManId;
    }

    public AddNewCustomerDTO() {
    }

    public UUID getMilkManId() {
        return milkManId;
    }

    public void setMilkManId(UUID milkManId) {
        this.milkManId = milkManId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }
}
