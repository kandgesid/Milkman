package com.milkman.template;

import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.observer.OrderEvent;
import com.milkman.service.LoggerService;
import com.milkman.service.OrderService;

import java.time.LocalDateTime;
import java.util.UUID;

public class CancelOrderProcessor extends AbstractOrderProcessor{
    private final UUID orderId;
    private final String remark;

    private final OrderService service;

    private MilkOrder order;
    private MilkmanCustomer mc;

    LoggerService logger = LoggerService.getInstance();

    public CancelOrderProcessor(UUID orderId, String remark, OrderService service) {
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
        mc = order.getMilkmanCustomer();
    }

    @Override
    protected void processCoreLogic() {
        logger.logInfo("Cancelling delivery for Order: " + order);
        double updatedDueAmount = mc.getDueAmount() - order.getAmount();
        mc.setLastUpdated(LocalDateTime.now());
        mc.setDueAmount(updatedDueAmount);
    }

    @Override
    protected void notifyObservers() {
        service.getPublisher().notifyAllObservers(new OrderEvent(order, "CANCELLED"));
    }

    @Override
    protected UUID updateDatabase() {
        service.saveMilkmanCustomer(mc);
        service.updateDeliveryStatusAndMoveToHistory(order, "NOT DELIVERED", remark);
        return order.getId();
    }
}
