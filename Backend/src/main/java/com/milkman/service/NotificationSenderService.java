package com.milkman.service;

public class NotificationSenderService {
    private static NotificationSenderService instance;

    private NotificationSenderService(){

    }

    public static synchronized NotificationSenderService getInstance(){
        if(instance == null){
            return new NotificationSenderService();
        }
        return instance;
    }

    public void notifyCustomer(String message) {
        System.out.println("🔔 [SIMULATED] Notification to Customer: " + message);
    }

    public void notifyMilkman(String message) {
        System.out.println("📨 [SIMULATED] Notification to Milkman: " + message);
    }
}
