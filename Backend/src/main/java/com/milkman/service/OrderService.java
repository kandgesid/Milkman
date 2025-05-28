package com.milkman.service;

import com.milkman.Billing.Decorator.CostCalculator;
import com.milkman.DAO.OrderServiceDAO;
import com.milkman.DTO.MilkOrderRequestDTO;
import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.DTO.OrderDTO;
import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.model.OrderHistory;
import com.milkman.observer.OrderEventPublisher;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderHistoryRepository;
import com.milkman.repository.OrderRepository;
import com.milkman.template.AbstractOrderProcessor;
import com.milkman.template.CancelOrderProcessor;
import com.milkman.template.ConfirmOrderProcessor;
import com.milkman.template.PlaceOrderProcessor;
import com.milkman.types.ErrorType;
import com.milkman.visitor.OrderSummaryVisitor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    public OrderRepository orderRepository;

    @Autowired
    public OrderHistoryRepository orderHistoryRepository;

    @Autowired
    public MilkmanCustomerRepository milkmanCustomerRepository;

    @Autowired
    public OrderServiceDAO orderServiceDAO;

    @Autowired
    public OrderEventPublisher orderEventPublisher;

    private final CostCalculator costCalculator;

    LoggerService logger = LoggerService.getInstance();

    public OrderService(CostCalculator costCalculator) {
        this.costCalculator = costCalculator;
    }

    public OrderEventPublisher getPublisher() {
        return this.orderEventPublisher;
    }

    public UUID processOrder(AbstractOrderProcessor processor) {
        return processor.execute();
    }

    public MilkOrder getOrderByIdOrThrow(UUID orderId){
        return orderRepository.findById(orderId).orElseThrow(() -> new DetailedExceptionBuilder()
                .withErrorCode("ORDER-404")
                .withStatusCode(HttpStatus.NOT_FOUND)
                .withType(ErrorType.BUSINESS)
                .withDetails("No order found for ID: " + orderId)
                .build());
    }

    public void saveMilkmanCustomer(MilkmanCustomer mc){
        milkmanCustomerRepository.save(mc);
    }


    public List<MilkOrderResponseDTO> getTodaysOrdersForMilkman(UUID milkmanId){
        try{
            return orderServiceDAO.getTodaysOrdersByMilkman(milkmanId);
        }catch(Exception ex){
            throw new DetailedExceptionBuilder()
                    .withErrorCode("ORDER-TODAY-500")
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withType(ErrorType.SYSTEM)
                    .withDetails(ex.toString())
                    .build();
        }
    }

    public MilkmanCustomer findAssociationOrThrow(UUID milkmanId, UUID customerId) {
        return milkmanCustomerRepository
                .findByMilkman_IdAndCustomer_Id(milkmanId, customerId)
                .orElseThrow(() -> new DetailedExceptionBuilder()
                        .withErrorCode("ASSOC-404")
                        .withStatusCode(HttpStatus.NOT_FOUND)
                        .withType(ErrorType.BUSINESS)
                        .build());
    }

    @Transactional
    public MilkOrder saveOrderAndUpdateDue(MilkOrder order) {
        try {
            MilkOrder savedOrder = orderRepository.save(order);
            MilkmanCustomer mc = order.getMilkmanCustomer();
            double updatedDue = mc.getDueAmount() + order.getAmount();
            mc.setDueAmount(updatedDue);
            mc.setLastUpdated(LocalDateTime.now());
            milkmanCustomerRepository.save(mc);
            return savedOrder;
        } catch (DataAccessException dae) {
            logger.logError("DB failure while saving order: " + dae.getMessage());
            throw new DetailedExceptionBuilder()
                    .withErrorCode("ORDER-DB-500")
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withType(ErrorType.DATABASE)
                    .withDetails(dae.getMessage())
                    .build();
        }
    }

    @Transactional
    public UUID placeMilkOrder(MilkOrderRequestDTO milkOrder) {
        return processOrder(new PlaceOrderProcessor(milkOrder, this, costCalculator));
    }


    @Transactional
    public void confirmOrderDelivery(final UUID orderId, final LocalDate orderDate, final String remark){
        processOrder(new ConfirmOrderProcessor(orderId, remark, this));
    }

    @Transactional
    public void cancelOrderDelivery(final UUID orderId, final LocalDate orderDate, final String remark) {
        processOrder(new CancelOrderProcessor(orderId, remark, this));
    }


    public void updateDeliveryStatusAndMoveToHistory(final MilkOrder order, final String status, final String remark){
        try{
            order.setStatus(status);
            orderRepository.save(order);

            OrderHistory history = new OrderHistory();
            history.setMilkOrder(order);
            history.setDeliveryDate(LocalDateTime.now());
            history.setStatus(status);
            history.setRemark(remark);
            orderHistoryRepository.save(history);

            logger.logInfo("Moved order to history: " + order.getId() + " with status: " + status);
        }catch (Exception ex){
            logger.logError("Failed to update delivery status & history: " + ex.getMessage());
            throw new DetailedExceptionBuilder()
                    .withErrorCode("ORDER-HISTORY-500")
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withType(ErrorType.DATABASE)
                    .withDetails(ex.getMessage())
                    .build();
        }
    }

    public Map<String, Object> generateOrderSummaryForMilkman(UUID milkmanId) {
        List<MilkOrder> orders = orderRepository.findByMilkmanCustomer_Milkman_Id(milkmanId);

        OrderSummaryVisitor visitor = new OrderSummaryVisitor();
        Iterator<MilkOrder> iterator = orders.iterator();
        while (iterator.hasNext()) {
            MilkOrder order = iterator.next();
            order.accept(visitor);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalOrders", visitor.getTotalOrders());
        summary.put("totalQuantity", visitor.getTotalQuantity());
        summary.put("totalRevenue", visitor.getTotalRevenue());

        return summary;
    }

    public List<OrderDTO> convertToOrderDTOs(List<MilkOrder> orders) {
        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO convertToOrderDTO(MilkOrder order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrder_id(order.getId());
        dto.setCustomerName(order.getMilkmanCustomer().getCustomer().getName());
        dto.setMilkmanName(order.getMilkmanCustomer().getMilkman().getName());
        dto.setMilkQuantity(order.getQuantity());
        dto.setStatus(order.getStatus());
        dto.setNote(order.getNote());
        dto.setAmount(order.getAmount());
        dto.setMilkRate(order.getRate());
        dto.setOrderDate(order.getOrderDate());
        return dto;
    }
}
