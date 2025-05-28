package com.milkman.observer.observers;

import com.milkman.Mediator.OrderEventMediator;
import com.milkman.observer.OrderEvent;
import org.springframework.stereotype.Component;


@Component
public class OrderMediatorObserver implements OrderEventObserver{
    OrderEventMediator mediator = new OrderEventMediator();

    @Override
    public void update(OrderEvent event) {
        mediator.handle(event);
    }
}
