package com.milkman.factory;

import com.milkman.nullable.INotificationSender;
import com.milkman.nullable.NullNotificationSenderService;
import com.milkman.service.NotificationSenderService;

public class NotificationServiceFactory {
    private static final boolean NOTIFICATION_ENABLED = true; // read from config or toggle

    public static INotificationSender getNotificationSender() {
        return NOTIFICATION_ENABLED
                ? NotificationSenderService.getInstance()
                : NullNotificationSenderService.getInstance();
    }
}
