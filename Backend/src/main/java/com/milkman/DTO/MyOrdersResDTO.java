package com.milkman.DTO;

import java.time.LocalDate;
import java.util.UUID;

public class MyOrdersResDTO {
    private UUID orderId;
    private UUID milkmanCustomerId;
    private String milkmanName;
    private LocalDate orderDate;
    private double quantity;
    private double rate;
    private double amount;
    private String note;
    private String status;

    public UUID getOrderId() {

        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public UUID getMilkmanCustomerId() {
        return milkmanCustomerId;
    }

    public void setMilkmanCustomerId(UUID milkmanCustomerId) {
        this.milkmanCustomerId = milkmanCustomerId;
    }

    public String getMilkmanName() {
        return milkmanName;
    }

    public void setMilkmanName(String milkmanName) {
        this.milkmanName = milkmanName;
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
}
