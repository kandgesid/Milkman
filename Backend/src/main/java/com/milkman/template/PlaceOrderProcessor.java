package com.milkman.template;

import com.milkman.Billing.Decorator.CostCalculator;
import com.milkman.DTO.MilkOrderRequestDTO;
import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.observer.OrderEvent;
import com.milkman.service.OrderService;
import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.UUID;


public class PlaceOrderProcessor extends AbstractOrderProcessor{
    private final MilkOrderRequestDTO request;


    private final OrderService service;

    private MilkmanCustomer mc;
    private MilkOrder order;
    private MilkOrder savedOrder;
    private final CostCalculator costCalculator;

    public PlaceOrderProcessor(MilkOrderRequestDTO request, OrderService service, CostCalculator costCalculator) {
        this.request = request;
        this.service = service;
        this.costCalculator = costCalculator;
    }

    @Override
    protected void validate() {

    }

    @Override
    protected void fetchEntities() {
        mc = service.findAssociationOrThrow(request.getMilkmanId(), request.getCustomerId());
    }

    @Override
    protected void processCoreLogic() {
        double milkRate = mc.getMilkRate();
        if(milkRate == 0){
            throw new DetailedExceptionBuilder()
                    .withErrorCode("INVALID-RATE-400")
                    .withType(ErrorType.BUSINESS)
                    .withStatusCode(HttpStatus.BAD_REQUEST)
                    .withDetails("No milk rate has been configured for your account. Please contact your milkman to set up your daily milk rate.")
                    .build();
        }

        double orderAmount = costCalculator.calculateCost(request.getRequestedQuantity(), milkRate);
        order = new MilkOrder();
        order.setQuantity(request.getRequestedQuantity());
        order.setMilkmanCustomer(mc);
        order.setRate(milkRate);
        order.setStatus("PENDING");
        order.setAmount(orderAmount);
        order.setOrderDate(request.getOrderDate());
        order.setCreatedAt(LocalDateTime.now());

    }

    @Override
    protected UUID updateDatabase() {
        savedOrder = service.saveOrderAndUpdateDue(order);
        return savedOrder.getId();
    }

    @Override
    protected void notifyObservers() {
        service.getPublisher().notifyAllObservers(new OrderEvent(savedOrder, "PLACED"));
    }
}
