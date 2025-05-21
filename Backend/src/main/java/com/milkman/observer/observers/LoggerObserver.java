package com.milkman.observer.observers;

import com.milkman.observer.OrderEvent;
import com.milkman.service.LoggerService;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class LoggerObserver implements OrderEventObserver{

    LoggerService logger = LoggerService.getInstance();

    @Override
    public void update(OrderEvent event) {
        String logMessage = switch (event.getEventType()) {
            case "PLACED" -> String.format(
                    "📦 New Order Placed - ID: %s | Customer: %s | Qty: %.2f | Date: %s",
                    event.getOrder().getId(),
                    event.getOrder().getMilkmanCustomer().getCustomer().getName(),
                    event.getOrder().getQuantity(),
                    event.getOrder().getOrderDate()
            );
            case "DELIVERED" -> String.format(
                    "✅ Order Delivered - ID: %s | Customer: %s | Delivered on: %s",
                    event.getOrder().getId(),
                    event.getOrder().getMilkmanCustomer().getCustomer().getName(),
                    LocalDateTime.now()
            );
            case "CANCELLED" -> String.format(
                    "❌ Order Cancelled - ID: %s | Customer: %s | Cancelled on: %s",
                    event.getOrder().getId(),
                    event.getOrder().getMilkmanCustomer().getCustomer().getName(),
                    LocalDateTime.now()
            );
            default -> "Unknown order event.";
        };

        logger.logInfo(logMessage);
    }
}
