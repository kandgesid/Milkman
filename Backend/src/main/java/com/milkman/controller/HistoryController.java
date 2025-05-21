package com.milkman.controller;

import com.milkman.DTO.MilkmanHistoryResponseDTO;
import com.milkman.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    HistoryService historyService;

    @GetMapping("/milkman/getHistory/")
    ResponseEntity<?> getHistoryForMilkmanAndCutomer(@RequestParam(name = "customerId") UUID customerId,
                                                     @RequestParam(name = "milkmanId") UUID milkmanId,
                                                     @RequestParam(name = "toDate") String toDate,
                                                     @RequestParam(name = "fromDate") String fromDate) {
        try {
            List<MilkmanHistoryResponseDTO> result= historyService.getHistory(customerId, milkmanId, toDate, fromDate);
            System.out.println(result.size());
            return ResponseEntity.ok(result);
        }catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }
}
