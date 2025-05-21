package com.milkman.observer;

import com.milkman.observer.observers.OrderEventObserver;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderEventPublisher {
    private List<OrderEventObserver> observers = new ArrayList<>();

    public void registerObserver(OrderEventObserver observer){
        observers.add(observer);
    }

    public void removeObserver(OrderEventObserver observer){
        observers.remove(observer);
    }

    public void notifyAllObservers(OrderEvent event){
        for(OrderEventObserver observer : observers){
            observer.update(event);
        }
    }
}
