package com.milkman.Billing.Decorator;

public class ServiceFeeDecorator extends CostCalculatorDecorator {
    public ServiceFeeDecorator(CostCalculator wrappee) { super(wrappee); }

    @Override
    public double calculateCost(double quantity, double rate) {
        return super.calculateCost(quantity, rate) + 2.50;
    }
}
