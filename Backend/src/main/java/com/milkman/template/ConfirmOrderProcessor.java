package com.milkman.template;

import com.milkman.model.MilkOrder;
import com.milkman.observer.OrderEvent;
import com.milkman.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

public class ConfirmOrderProcessor extends AbstractOrderProcessor{
    private final UUID orderId;
    private final String remark;


    private OrderService service;

    private MilkOrder order;

    public ConfirmOrderProcessor(UUID orderId, String remark, OrderService service) {
        this.orderId = orderId;
        this.remark = remark;
        this.service = service;
    }

    @Override
    protected void validate() {

    }

    @Override
    protected void fetchEntities() {
        order = service.getOrderByIdOrThrow(orderId);
    }

    @Override
    protected void processCoreLogic() {

    }

    @Override
    protected UUID updateDatabase() {
        service.updateDeliveryStatusAndMoveToHistory(order, "DELIVERED", remark);
        return orderId;
    }

    @Override
    protected void notifyObservers() {
        service.getPublisher().notifyAllObservers(new OrderEvent(order, "DELIVERED"));
    }
}
