package com.milkman.config;

import com.milkman.Billing.Decorator.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BillingConfig {
    @Bean
    public CostCalculator costCalculator() {
        // Decoration order: Base → Discount → Tax → Service Fee
        return new ServiceFeeDecorator(
                new TaxDecorator(
                        new DiscountDecorator(
                                new BaseCostCalculator()
                        )
                )
        );
    }
}
