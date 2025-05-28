package com.milkman.strategy;

import com.milkman.DAO.HistoryServiceDAO;
import com.milkman.DTO.HistoryRequestDTO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class CustomDateRangeReportStrategy implements OrderReportStrategy{

    private final HistoryServiceDAO historyServiceDAO;
    private final LocalDate to;
    private final LocalDate from;
    private final UUID milkmanId;
    private final UUID customerId;

    public CustomDateRangeReportStrategy(HistoryServiceDAO historyServiceDAO, HistoryRequestDTO requestDTO){
        this.historyServiceDAO = historyServiceDAO;
        this.to = LocalDate.parse(requestDTO.getToDate());
        this.from = LocalDate.parse(requestDTO.getFromDate());
        this.milkmanId = requestDTO.getMilkmanId();
        this.customerId = requestDTO.getCustomerId();
    }
    @Override
    public List<MilkmanHistoryResponseDTO> generateReport() {
        return historyServiceDAO.getHistoryForGivenMilkmanAndCustomer(milkmanId, customerId, from, to);
    }
}
