package com.milkman.strategy;

import com.milkman.DAO.HistoryServiceDAO;
import com.milkman.DTO.HistoryRequestDTO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.service.LoggerService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

public class CustomDateRangeReportStrategy implements OrderReportStrategy{


    LoggerService logger = LoggerService.getInstance();

    private final HistoryServiceDAO historyServiceDAO;
    private final LocalDate to;
    private final LocalDate from;
    private final UUID milkmanId;
    private final UUID customerId;

    public CustomDateRangeReportStrategy(HistoryServiceDAO historyServiceDAO, HistoryRequestDTO requestDTO){
        this.historyServiceDAO = historyServiceDAO;
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        this.from = LocalDate.parse(requestDTO.getFromDate(), formatter);
        this.to = LocalDate.parse(requestDTO.getToDate(), formatter).plusDays(1);
        logger.logInfo("CustomDateRangeReportStrategy: from=" + from + ", to=" + to);
        this.milkmanId = requestDTO.getMilkmanId();
        this.customerId = requestDTO.getCustomerId();
    }
    @Override
    public List<MilkmanHistoryResponseDTO> generateReport() {
        return historyServiceDAO.getHistoryForGivenMilkmanAndCustomer(milkmanId, customerId, from, to);
    }
}
