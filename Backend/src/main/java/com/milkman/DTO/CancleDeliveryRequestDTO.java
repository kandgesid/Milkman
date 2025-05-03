package com.milkman.DTO;

public class CancleDeliveryRequestDTO {
    private String orderDate;
    private String remark;

    public String getRemark() {

        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }
}
