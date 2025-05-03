package com.milkman.controller;


import com.milkman.DTO.CancleDeliveryRequestDTO;
import com.milkman.DTO.ConfirmDeliveryRequestDTO;
import com.milkman.DTO.MilkOrderRequestDTO;
import com.milkman.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    public OrderService orderService;

    @PostMapping("/")
    public ResponseEntity<?> saveMilkOrder(@RequestBody MilkOrderRequestDTO milkOrder){
        // TODO : verify request body
        try {
            UUID orderId = orderService.placeMilkOrder(milkOrder);
            return ResponseEntity.status(HttpStatus.OK).body(orderId);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @PostMapping("/milkman-customer/{id}/deliveries")
    public ResponseEntity<?> confirmDelivery(@PathVariable("id") UUID id, @RequestBody ConfirmDeliveryRequestDTO deliveryDetails){
        try{
            System.out.println("Confirm delivery: " + id);
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
            LocalDate localDate = LocalDate.parse(deliveryDetails.getOrderDate(), formatter);
            orderService.confirmOrderDelivery(id, localDate, deliveryDetails.getRemark());
            return ResponseEntity.status(HttpStatus.OK).body("Delivery confirmed and recorded");
        }catch(Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @PostMapping("/milkman-customer/{id}/cancelOrder")
    public ResponseEntity<?> cancelDelivery(@PathVariable("id") UUID id, @RequestBody CancleDeliveryRequestDTO deliveryDetails){
        try{
            System.out.println("Cancel delivery: " + id);
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
            LocalDate localDate = LocalDate.parse(deliveryDetails.getOrderDate(), formatter);
            orderService.cancelOrderDelivery(id, localDate, deliveryDetails.getRemark());
            return ResponseEntity.status(HttpStatus.OK).body("Delivery canceled and recorded");
        }catch(Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }


}
