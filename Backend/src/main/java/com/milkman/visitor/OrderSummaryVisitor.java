package com.milkman.visitor;

import com.milkman.model.MilkOrder;

public class OrderSummaryVisitor implements OrderVisitor{
    private int totalOrders = 0;
    private double totalQuantity = 0;
    private double totalRevenue = 0;

    @Override
    public void visit(MilkOrder order) {
        totalOrders++;
        totalQuantity += order.getQuantity();
        totalRevenue += order.getAmount();
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public double getTotalQuantity() {
        return totalQuantity;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }
}
