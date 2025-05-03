package com.milkman.DTO;

import java.time.LocalDate;

public class ConfirmDeliveryRequestDTO {
    private String orderDate;
    private String remark;

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
