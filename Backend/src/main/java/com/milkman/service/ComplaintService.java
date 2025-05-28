package com.milkman.service;


import com.milkman.DTO.ComplaintActionDTO;
import com.milkman.DTO.ComplaintRequestDTO;
import com.milkman.exception.ComplaintNotFoundException;
import com.milkman.exception.CustomerNotFoundException;
import com.milkman.exception.MilkmanNotFoundException;
import com.milkman.model.Complaint;
import com.milkman.model.Customer;
import com.milkman.model.Milkman;
import com.milkman.repository.ComplaintRepository;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanRepository;
import com.milkman.state.complaint.ComplaintContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ComplaintService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    MilkmanRepository milkmanRepository;

    @Autowired
    ComplaintRepository complaintRepository;


    Complaint getComplaintById(UUID id){
        Complaint complaint = complaintRepository.findById(id).
                orElseThrow(() -> new ComplaintNotFoundException(id));
        return complaint;
    }


    @Transactional
    public UUID submitComplaint(ComplaintRequestDTO request){
        Complaint complaint = new Complaint();
        if(request.getMilkmanId() != null){
            Milkman milkman = milkmanRepository.findById(request.getMilkmanId())
                    .orElseThrow(() -> new MilkmanNotFoundException(request.getMilkmanId()));
            complaint.setAssignedToMilkmanId(milkman);
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new CustomerNotFoundException(request.getCustomerId()));

        complaint.setCustomer(customer);
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setStatus("NEW");
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setLastUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint).getId();

    }

    @Transactional
    public void updateComplaintState(UUID complaintId, ComplaintActionDTO request){
        Complaint complaint = getComplaintById(complaintId);
        complaint.setAction(request.getAction());
        ComplaintContext context = new ComplaintContext(complaint);
        context.handle(); // trigger handle() on current state

        context.getComplaint().setLastUpdatedAt(LocalDateTime.now());
        complaintRepository.save(context.getComplaint());
    }
}
