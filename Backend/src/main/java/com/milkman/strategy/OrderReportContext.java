package com.milkman.strategy;

import com.milkman.DTO.MilkmanHistoryResponseDTO;

import java.util.List;

public class OrderReportContext {
    private OrderReportStrategy strategy;

    public void setStrategy(OrderReportStrategy strategy) {
        this.strategy = strategy;
    }

    public List<MilkmanHistoryResponseDTO> generate() {
        return strategy.generateReport();
    }
}
