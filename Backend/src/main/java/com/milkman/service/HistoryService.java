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

@Service
public class HistoryService {

    @Autowired
    MilkmanCustomerRepository milkmanCustomerRepository;

    @Autowired
    OrderHistoryRepository orderHistoryRepository;

    @Autowired
    HistoryServiceDAO historyServiceDAO;

    public List<MilkmanHistoryResponseDTO> getHistory(GetHistoryDTO request){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        LocalDate from = LocalDate.parse(request.getFromDate(), formatter);
        LocalDate to = LocalDate.parse(request.getToDate(), formatter);
        return historyServiceDAO.getHistoryForGivenMilkmanAndCustomer(request.getMilkmanId(), request.getCustomerId(), from ,to);
    }

}
