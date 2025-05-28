package com.milkman.Billing.Decorator;

public abstract class CostCalculatorDecorator implements CostCalculator {
    protected final CostCalculator wrappee;

    protected CostCalculatorDecorator(CostCalculator wrappee) {
        this.wrappee = wrappee;
    }

    @Override
    public double calculateCost(double quantity, double rate) {
        return wrappee.calculateCost(quantity, rate);
    }
}
