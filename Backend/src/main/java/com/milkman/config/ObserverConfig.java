package com.milkman.config;

import com.milkman.observer.OrderEventPublisher;
import com.milkman.observer.observers.OrderMediatorObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ObserverConfig {

//    @Autowired
//    private LoggerObserver loggerObserver;
//
//    @Autowired
//    private NotificationObserver notificationObserver;

    @Autowired
    private OrderMediatorObserver orderMediatorObserver;

    @Bean
    public OrderEventPublisher orderEventPublisher(){
        OrderEventPublisher publisher = new OrderEventPublisher();

//        publisher.registerObserver(loggerObserver);
//        publisher.registerObserver(notificationObserver);
        publisher.registerObserver(orderMediatorObserver);

        return publisher;
    }
}
