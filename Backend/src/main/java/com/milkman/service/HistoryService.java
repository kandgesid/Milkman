package com.milkman.service;

import com.milkman.DAO.HistoryServiceDAO;
import com.milkman.DTO.GetHistoryDTO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.model.MilkmanCustomer;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        LocalDate to = LocalDate.parse(toDate, formatter);
        return historyServiceDAO.getHistoryForGivenMilkmanAndCustomer(milkmanId, customerId, from ,to);
    }

}
