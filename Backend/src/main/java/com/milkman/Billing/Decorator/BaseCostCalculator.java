package com.milkman.Billing.Decorator;

public class BaseCostCalculator implements CostCalculator {

    @Override
    public double calculateCost(double quantity, double rate) {
        return quantity * rate;
    }
}
