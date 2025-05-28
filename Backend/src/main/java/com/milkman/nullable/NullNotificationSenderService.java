package com.milkman.nullable;

public class NullNotificationSenderService implements INotificationSender{

    private static final NullNotificationSenderService instance = new NullNotificationSenderService();

    private NullNotificationSenderService() {}

    public static NullNotificationSenderService getInstance() {
        return instance;
    }

    @Override
    public void notifyCustomer(String message) {
        // Intentionally left blank
    }

    @Override
    public void notifyMilkman(String message) {
        // Intentionally left blank
    }
}
