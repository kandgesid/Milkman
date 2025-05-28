package com.milkman.Billing.Decorator;

public interface CostCalculator {
    double calculateCost(double quantity, double rate);
}
