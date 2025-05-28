package com.milkman.strategy;

import com.milkman.DTO.MilkmanHistoryResponseDTO;

import java.util.List;

public interface OrderReportStrategy {
    List<MilkmanHistoryResponseDTO> generateReport();
}
