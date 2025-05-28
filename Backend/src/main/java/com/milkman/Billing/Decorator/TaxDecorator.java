package com.milkman.Billing.Decorator;

public class TaxDecorator extends CostCalculatorDecorator {
    public TaxDecorator(CostCalculator wrappee) { super(wrappee); }

    @Override
    public double calculateCost(double quantity, double rate) {
        return super.calculateCost(quantity, rate) * 1.05;
    }
}
