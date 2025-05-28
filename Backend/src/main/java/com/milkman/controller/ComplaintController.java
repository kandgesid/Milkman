package com.milkman.controller;

import com.milkman.DTO.ComplaintActionDTO;
import com.milkman.DTO.ComplaintRequestDTO;
import com.milkman.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/complaint")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    ComplaintService complaintService;

    @PostMapping("/")
    public ResponseEntity<?> submitComplaint(@RequestBody ComplaintRequestDTO dto) {
        UUID complaintId = complaintService.submitComplaint(dto);
        return ResponseEntity.ok(complaintId);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable UUID id, @RequestBody ComplaintActionDTO requestDTO){
        complaintService.updateComplaintState(id, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body("Complaint successfully moved to next state");
    }
}
