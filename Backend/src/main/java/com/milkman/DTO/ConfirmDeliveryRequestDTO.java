package com.milkman.DTO;

import java.time.LocalDate;

public class ConfirmDeliveryRequestDTO {
    private LocalDate orderDate;
    private String remark;

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
