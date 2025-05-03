package com.milkman.service;

import com.milkman.DTO.GetHistoryDTO;
import com.milkman.model.MilkmanCustomer;
import com.milkman.repository.MilkmanCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoryService {

    @Autowired
    MilkmanCustomerRepository milkmanCustomerRepository;

//    private List<HistoryResponseDTO> getHistory(GetHistoryDTO request){
//        Optional<MilkmanCustomer> associationOpt = milkmanCustomerRepository.findByMilkman_IdAndCustomer_Id(request.getMilkmanId(), request.getCustomerId());
//        if (associationOpt.isEmpty()) {
//            throw new RuntimeException("Milkman-customer association not found");
//        }
//
//
//    }

}
