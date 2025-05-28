package com.milkman.controller;


import com.milkman.DTO.HistoryRequestDTO;
import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    HistoryService historyService;

    @PostMapping ("/milkman/getHistory/")
    ResponseEntity<?> getHistoryForMilkmanAndCutomer(@RequestBody HistoryRequestDTO request) {

//            System.out.println("Request: " + customerId + " ," + milkmanId + " ," + toDate + " ," + fromDate);
//            List<MilkmanHistoryResponseDTO> result= historyService.getHistory(customerId, milkmanId, toDate, fromDate);
//            System.out.println(result.size());
//            return ResponseEntity.ok(result);
        List<MilkmanHistoryResponseDTO> report = historyService.generateHistoryReport(request);
        return ResponseEntity.ok(report);
    }
}
