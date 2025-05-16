package com.milkman.DTO;

import java.time.LocalDate;
import java.util.UUID;

public class MilkmanHistoryResponseDTO {
    private UUID order_id;
    private double due_amount;
    private double quantity;
    private double milk_rate;
    private String delivery_status;
    private LocalDate delivery_date;

    public LocalDate getDelivery_date() {
        return delivery_date;
    }

    public void setDelivery_date(LocalDate delivery_date) {
        this.delivery_date = delivery_date;
    }

    public UUID getOrder_id() {
        return order_id;
    }

    public void setOrder_id(UUID order_id) {
        this.order_id = order_id;
    }

    public double getDue_amount() {
        return due_amount;
    }

    public void setDue_amount(double due_amount) {
        this.due_amount = due_amount;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getMilk_rate() {
        return milk_rate;
    }

    public void setMilk_rate(double milk_rate) {
        this.milk_rate = milk_rate;
    }

    public String getDelivery_status() {
        return delivery_status;
    }

    public void setDelivery_status(String delivery_status) {
        this.delivery_status = delivery_status;
    }

    @Override
    public String toString() {
        return "MilkmanHistoryResponseDTO{" +
                "order_id=" + order_id +
                ", due_amount=" + due_amount +
                ", quantity=" + quantity +
                ", milk_rate=" + milk_rate +
                ", delivery_status='" + delivery_status + '\'' +
                '}';
    }
}
