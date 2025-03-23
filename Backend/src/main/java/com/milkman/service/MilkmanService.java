package com.milkman.service;

import com.milkman.model.Milkman;
import com.milkman.repository.MilkmanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MilkmanService {
    
    @Autowired
    private MilkmanRepository milkmanRepository;
    
    public List<Milkman> getAllMilkman() {
        return milkmanRepository.findAll();
    }
    
    public Optional<Milkman> getMilkmanById(Long id) {
        return milkmanRepository.findById(id);
    }
    
    public Milkman createMilkman(Milkman milkman) {
        return milkmanRepository.save(milkman);
    }
    
    public Milkman updateMilkman(Long id, Milkman userDetails) {
        Milkman user = milkmanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milkman not found"));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setAddress(userDetails.getAddress());
        
        return milkmanRepository.save(user);
    }
    
    public void deleteMilkman(Long id) {
        milkmanRepository.deleteById(id);
    }
} 