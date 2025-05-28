package com.milkman.Mediator;

import com.milkman.factory.NotificationServiceFactory;
import com.milkman.model.MilkOrder;
import com.milkman.nullable.INotificationSender;
import com.milkman.observer.OrderEvent;
import com.milkman.service.LoggerService;

import java.time.LocalDateTime;

public class OrderEventMediator {

    LoggerService logger = LoggerService.getInstance();

    private final INotificationSender notificationService;

    public OrderEventMediator() {
        this.notificationService = NotificationServiceFactory.getNotificationSender();
    }

    public void handle(OrderEvent event){
        MilkOrder order = event.getOrder();

        String customerMessage;
        String milkmanMessage;
        String logMessage;

        switch (event.getEventType()) {
            case "PLACED":
                customerMessage = String.format(
                        "📦 Hello %s, your milk order of %.2fL has been placed for %s.",
                        order.getMilkmanCustomer().getCustomer().getName(),
                        order.getQuantity(),
                        order.getOrderDate()
                );

                milkmanMessage = String.format(
                        "📥 New Order: %s placed %.2fL for delivery on %s.",
                        order.getMilkmanCustomer().getCustomer().getName(),
                        order.getQuantity(),
                        order.getOrderDate()
                );

                logMessage = String.format(
                        "📦 New Order Placed - ID: %s | Customer: %s | Qty: %.2f | Date: %s",
                        event.getOrder().getId(),
                        event.getOrder().getMilkmanCustomer().getCustomer().getName(),
                        event.getOrder().getQuantity(),
                        event.getOrder().getOrderDate());
                break;

            case "DELIVERED":
                customerMessage = String.format(
                        "✅ Delivery Confirmed: Your milk order of %.2fL on %s has been delivered.",
                        order.getQuantity(),
                        order.getOrderDate()
                );

                milkmanMessage = String.format(
                        "✅ Order Delivered: %s’s order of %.2fL delivered on %s.",
                        order.getMilkmanCustomer().getCustomer().getName(),
                        order.getQuantity(),
                        LocalDateTime.now()
                );

                logMessage = String.format(
                        "✅ Order Delivered - ID: %s | Customer: %s | Delivered on: %s",
                        event.getOrder().getId(),
                        event.getOrder().getMilkmanCustomer().getCustomer().getName(),
                        LocalDateTime.now());
                break;

            case "CANCELLED":
                customerMessage = String.format(
                        "❌ Alert: Your milk order of %.2fL on %s was cancelled.",
                        order.getQuantity(),
                        order.getOrderDate()
                );

                milkmanMessage = String.format(
                        "❌ Order Cancelled: %s’s order for %s has been marked as not delivered.",
                        order.getMilkmanCustomer().getCustomer().getName(),
                        order.getOrderDate()
                );

                logMessage = String.format(
                        "❌ Order Cancelled - ID: %s | Customer: %s | Cancelled on: %s",
                        event.getOrder().getId(),
                        event.getOrder().getMilkmanCustomer().getCustomer().getName(),
                        LocalDateTime.now());
                break;

            default:
                customerMessage = "🔔 Notification: An update occurred on your order.";
                milkmanMessage = "🔔 Milkman Update: An unknown order event occurred.";
                logMessage = "Unknown order event.";
        }

        notificationService.notifyCustomer(customerMessage);
        notificationService.notifyMilkman(milkmanMessage);
        logger.logInfo(logMessage);
    }
}
