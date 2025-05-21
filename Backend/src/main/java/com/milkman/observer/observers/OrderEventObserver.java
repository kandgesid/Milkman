package com.milkman.observer.observers;

import com.milkman.observer.OrderEvent;

public interface OrderEventObserver {
    void update(OrderEvent event);
}
