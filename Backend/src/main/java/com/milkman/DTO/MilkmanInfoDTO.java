package com.milkman.DTO;

import java.util.UUID;

public class MilkmanInfoDTO {
    private UUID id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private double milkRate;
    private double dueAmount;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getMilkRate() {
        return milkRate;
    }

    public void setMilkRate(double milkRate) {
        this.milkRate = milkRate;
    }

    public double getDueAmount() {
        return dueAmount;
    }

    public void setDueAmount(double dueAmount) {
        this.dueAmount = dueAmount;
    }

    @Override
    public String toString() {
        return "MilkmanCustomerDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", milkRate=" + milkRate +
                ", dueAmount=" + dueAmount +
                '}';
    }
}
