package com.milkman.controller;

import com.milkman.DTO.CustomerInfoDTO;
import com.milkman.DTO.GetHistoryDTO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.model.Milkman;
import com.milkman.model.MilkmanCustomer;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.service.HistoryService;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    HistoryService historyService;

    @GetMapping("/milkman/getHistory/")
    ResponseEntity<?> getHistoryForMilkmanAndCutomer(@RequestBody GetHistoryDTO request) {
        try {
            List<MilkmanHistoryResponseDTO> result= historyService.getHistory(request);
            return ResponseEntity.ok(result);
        }catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }
}
