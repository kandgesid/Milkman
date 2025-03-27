package com.milkman.controller;

import com.milkman.model.Milkman;
import com.milkman.service.MilkmanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/milkman")
@CrossOrigin(origins = "*")
public class MilkmanController {
    
    @Autowired
    private MilkmanService milkmanService;
    
    @GetMapping
    public List<Milkman> getAllMilkman() {
        return milkmanService.getAllMilkman();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Milkman> getMilkmanById(@PathVariable UUID id) {
        return milkmanService.getMilkmanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Milkman createMilkman(@RequestBody Milkman user) {
        return milkmanService.createMilkman(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Milkman> updateMilkman(@PathVariable UUID id, @RequestBody Milkman userDetails) {
        try {
            Milkman updatedMilkman = milkmanService.updateMilkman(id, userDetails);
            return ResponseEntity.ok(updatedMilkman);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMilkman(@PathVariable UUID id) {
        milkmanService.deleteMilkman(id);
        return ResponseEntity.ok().build();
    }
} 