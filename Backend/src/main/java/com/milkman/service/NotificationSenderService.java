package com.milkman.service;

import com.milkman.nullable.INotificationSender;

public class NotificationSenderService implements INotificationSender {
    private static NotificationSenderService instance;

    private NotificationSenderService(){

    }

    public static synchronized NotificationSenderService getInstance(){
        if(instance == null){
            return new NotificationSenderService();
        }
        return instance;
    }

    @Override
    public void notifyCustomer(String message) {
        System.out.println("🔔 [SIMULATED] Notification to Customer: " + message);
    }

    @Override
    public void notifyMilkman(String message) {
        System.out.println("📨 [SIMULATED] Notification to Milkman: " + message);
    }
}
