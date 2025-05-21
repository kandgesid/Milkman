package com.milkman.observer.observers;

import com.milkman.model.MilkOrder;
import com.milkman.observer.OrderEvent;
import com.milkman.service.NotificationSenderService;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationObserver implements OrderEventObserver{
    private final NotificationSenderService notificationService = NotificationSenderService.getInstance();

    @Override
    public void update(OrderEvent event) {
        MilkOrder order = event.getOrder();

        String customerMessage;
        String milkmanMessage;

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
                break;

            default:
                customerMessage = "🔔 Notification: An update occurred on your order.";
                milkmanMessage = "🔔 Milkman Update: An unknown order event occurred.";
        }

        notificationService.notifyCustomer(customerMessage);
        notificationService.notifyMilkman(milkmanMessage);
    }
}
