package com.milkman.Billing.Decorator;

public class DiscountDecorator extends CostCalculatorDecorator {
    public DiscountDecorator(CostCalculator wrappee) { super(wrappee); }

    @Override
    public double calculateCost(double quantity, double rate) {
        double cost = super.calculateCost(quantity, rate);
        return quantity >= 10 ? cost * 0.9 : cost;
    }
}
