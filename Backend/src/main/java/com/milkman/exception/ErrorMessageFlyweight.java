package com.milkman.exception;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ErrorMessageFlyweight {
    private static final Map<String,String> TEMPLATES = new ConcurrentHashMap<>();

    static {
        TEMPLATES.put("ORDER-DB-500", "Unable to save order to database");
        TEMPLATES.put("AUTH-404-USER",  "User not found, Login Failed");

        TEMPLATES.put("CUSTOMER-MILKMAN-500", "Failed to fetch customers for milkman");
        TEMPLATES.put("DB-500",  "Database operation failed");
        TEMPLATES.put("GEN-500", "Unexpected error");
        TEMPLATES.put("ORDER-404", "Invalid orderId, Order not found");
        TEMPLATES.put("ORDER-TODAY-500", "Unable to fetch today's order for milkman");
        TEMPLATES.put("ASSOC-404", "Milkman-Customer association not found");
        TEMPLATES.put("ORDER-HISTORY-500", "Unable to update delivery status and history");
        TEMPLATES.put("ORDER-TEMPLATE-500", "Order processing failed");
        TEMPLATES.put("INVALID-RATE-400", "Invalid parameter, milk rate cannot be zero");
        TEMPLATES.put("COMPLAINT-ACTION-INVALID", "Invalid action, Unsupported complaint action");

    }

    private ErrorMessageFlyweight() {}

    /**
     * Fetch the canonical message template for a code.
     * Returns the code itself if no template is found.
     */
    public static String get(String errorCode) {
        return TEMPLATES.getOrDefault(errorCode, errorCode);
    }
}
