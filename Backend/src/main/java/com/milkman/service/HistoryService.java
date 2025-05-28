package com.milkman.service;

import com.milkman.DAO.HistoryServiceDAO;
import com.milkman.DTO.HistoryRequestDTO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.exception.ApiException;
import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderHistoryRepository;
import com.milkman.strategy.CustomDateRangeReportStrategy;
import com.milkman.strategy.MonthlyTotalReportStrategy;
import com.milkman.strategy.OrderReportContext;
import com.milkman.strategy.OrderReportStrategy;
import com.milkman.types.ErrorType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class HistoryService {

    @Autowired
    MilkmanCustomerRepository milkmanCustomerRepository;

    @Autowired
    OrderHistoryRepository orderHistoryRepository;

    @Autowired
    HistoryServiceDAO historyServiceDAO;

    public List<MilkmanHistoryResponseDTO> getHistory(UUID customerId, UUID milkmanId, String toDate, String fromDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        LocalDate from = LocalDate.parse(fromDate, formatter);
        LocalDate to = LocalDate.parse(toDate, formatter).plusDays(1);
        return historyServiceDAO.getHistoryForGivenMilkmanAndCustomer(milkmanId, customerId, from ,to);
    }

    public List<MilkmanHistoryResponseDTO> generateHistoryReport(final HistoryRequestDTO request){
        try {
            if (request.getStrategy() == null || request.getStrategy().isBlank()) {
                throw new DetailedExceptionBuilder()
                        .withStatusCode(HttpStatus.BAD_REQUEST)
                        .withErrorCode("HISTORY-STRATEGY-MISSING")
                        .withType(ErrorType.BUSINESS)
                        .withDetails("Expected values: CUSTOM, MONTHLY")
                        .build();
            }

            OrderReportContext context = new OrderReportContext();
            OrderReportStrategy strategy;

            if (request.getStrategy().equalsIgnoreCase("MONTHLY")) {
                strategy = new MonthlyTotalReportStrategy(historyServiceDAO, request.getMilkmanId(), request.getCustomerId());
            } else {
                strategy = new CustomDateRangeReportStrategy(historyServiceDAO, request);
            }

            context.setStrategy(strategy);
            return context.generate();

        } catch (ApiException ae) {
            throw ae;
        } catch (Exception ex) {
            throw new DetailedExceptionBuilder()
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withErrorCode("HISTORY-REPORT-FAILURE")
                    .withType(ErrorType.SYSTEM)
                    .withDetails(ex.getMessage())
                    .build();
        }
    }

}
