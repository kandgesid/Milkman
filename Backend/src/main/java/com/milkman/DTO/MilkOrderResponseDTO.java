package com.milkman.DTO;

import java.time.LocalDate;
import java.util.UUID;

public class MilkOrderResponseDTO {
    private UUID milkmanCustomerId;
    private String customerName;
    private String note;
    private LocalDate orderDate;
    private double milkQuantity;
    private String status;
    private String customerAddress;
    private UUID orderId;

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public MilkOrderResponseDTO(UUID milkmanCustomerId, String customerName, String note, LocalDate orderDate,
                                double milkQuantity, String status, String customerAddress, UUID orderId) {
        this.milkmanCustomerId = milkmanCustomerId;
        this.customerName = customerName;
        this.note = note;
        this.orderDate = orderDate;
        this.milkQuantity = milkQuantity;
        this.status = status;
        this.customerAddress = customerAddress;
        this.orderId = orderId;
    }

    public MilkOrderResponseDTO() {}
    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public double getMilkQuantity() {
        return milkQuantity;
    }

    public void setMilkQuantity(double milkQuantity) {
        this.milkQuantity = milkQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public UUID getMilkmanCustomerId() {
        return milkmanCustomerId;
    }

    public void setMilkmanCustomerId(UUID milkmanCustomerId) {
        this.milkmanCustomerId = milkmanCustomerId;
    }
}
