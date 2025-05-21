package com.milkman.config;

import com.milkman.observer.OrderEventPublisher;
import com.milkman.observer.observers.LoggerObserver;
import com.milkman.observer.observers.NotificationObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ObserverConfig {

    @Autowired
    private LoggerObserver loggerObserver;

    @Autowired
    private NotificationObserver notificationObserver;

    @Bean
    public OrderEventPublisher orderEventPublisher(){
        OrderEventPublisher publisher = new OrderEventPublisher();

        publisher.registerObserver(loggerObserver);
        publisher.registerObserver(notificationObserver);

        return publisher;
    }
}
