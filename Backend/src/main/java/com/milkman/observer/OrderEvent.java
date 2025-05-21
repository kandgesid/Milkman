package com.milkman.observer;

import com.milkman.model.MilkOrder;

import java.time.LocalDateTime;
import java.util.UUID;

public class OrderEvent {
    private final MilkOrder order;
    private final LocalDateTime timestamp;
    private String eventType;

    public OrderEvent(MilkOrder order, String eventType) {
        this.order = order;
        this.timestamp = LocalDateTime.now();
        this.eventType = eventType;
    }

    public MilkOrder getOrder() {
        return order;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
}
