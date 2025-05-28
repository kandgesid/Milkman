package com.milkman.strategy;

import com.milkman.DAO.HistoryServiceDAO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class MonthlyTotalReportStrategy implements OrderReportStrategy{

    private final HistoryServiceDAO historyServiceDAO;
    private final UUID milkmanId;
    private final UUID customerId;

    public MonthlyTotalReportStrategy(HistoryServiceDAO historyServiceDAO, UUID milkmanId, UUID customerId) {
        this.historyServiceDAO = historyServiceDAO;
        this.milkmanId = milkmanId;
        this.customerId = customerId;
    }

    @Override
    public List<MilkmanHistoryResponseDTO> generateReport() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1);
        return historyServiceDAO.getHistoryForGivenMilkmanAndCustomer(milkmanId, customerId, startOfMonth, endOfMonth);
    }

}
