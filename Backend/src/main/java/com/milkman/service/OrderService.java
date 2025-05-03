package com.milkman.service;

import com.milkman.DTO.MilkOrderRequestDTO;
import com.milkman.DTO.MilkOrderResponseDTO;
import com.milkman.DTO.OrderDTO;
import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.model.OrderHistory;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderHistoryRepository;
import com.milkman.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    public OrderRepository orderRepository;

    @Autowired
    public OrderHistoryRepository orderHistoryRepository;

    @Autowired
    public MilkmanCustomerRepository milkmanCustomerRepository;

    public OrderDTO getOrderById(UUID id) throws Exception {
        MilkOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new Exception("Order not found: " + id));
        return convertToOrderDTO(order);
    }
    public List<OrderDTO> getAllOrdersForCustomer(UUID customerId){
        List<MilkOrder> customerOrders = orderRepository.findByMilkmanCustomer_Customer_Id(customerId);
        return convertToOrderDTOs(customerOrders);
    }

    public List<OrderDTO> getAllOrdersForMilkman(UUID milkmanId){
        List<MilkOrder> milkmanOrders = orderRepository.findByMilkmanCustomer_Milkman_Id(milkmanId);
        return convertToOrderDTOs(milkmanOrders);
    }

    public List<MilkOrderResponseDTO> getTodaysOrdersForMilkman(UUID milkmanId){
        try{
            return orderRepository.getOrdersToBeDelivered(milkmanId, LocalDate.now());
        }catch(Exception ex){
            throw new RuntimeException("Error while fetching today's milk orders");
        }
    }

    @Transactional
    public UUID placeMilkOrder(MilkOrderRequestDTO milkOrder) throws Exception {

        Optional<MilkmanCustomer> associationOpt = milkmanCustomerRepository.findByMilkman_IdAndCustomer_Id(milkOrder.getMilkmanId(), milkOrder.getCustomerId());
        if (associationOpt.isEmpty()) {
            throw new RuntimeException("Milkman-customer association not found");
        }


        double milkRate = associationOpt.get().getMilkRate();
        if(milkRate == 0){
            throw new Exception("No milk rate has been configured for your account. Please contact your milkman to set up your daily milk rate.");
        }

        double orderAmount = milkOrder.getRequestedQuantity() * milkRate;
        double updatedDueAmount = associationOpt.get().getDueAmount() + orderAmount;
        System.out.println("Milk rate for Customer : " + milkOrder.getCustomerId() + " is :" + milkRate);

        MilkOrder newOrder = new MilkOrder();
        newOrder.setQuantity(milkOrder.getRequestedQuantity());
        newOrder.setMilkmanCustomer(associationOpt.get());
        newOrder.setRate(milkRate);
        newOrder.setStatus("PENDING");
        newOrder.setAmount(orderAmount);
        newOrder.setOrderDate(milkOrder.getOrderDate());
        newOrder.setCreatedAt(LocalDateTime.now());

        try{
            MilkOrder savedOrder = orderRepository.save(newOrder);
            System.out.println(savedOrder.toString());
            System.out.println("UPDATE THE DUE AMOUNT : " + associationOpt.get().getId() + " " + updatedDueAmount + " " + LocalDateTime.now());
            int updatedRow = milkmanCustomerRepository.updateCustomerDueAmount(associationOpt.get().getId(), updatedDueAmount, LocalDateTime.now());
            System.out.println(updatedRow);
            return savedOrder.getId();
        }catch (Exception ex){
            System.err.println("Failed to save Order: " + ex.getMessage());
            // Optionally, wrap it in a custom exception:
            throw new RuntimeException("Unable to save order record", ex);
        }
    }

    @Transactional
    public void confirmOrderDelivery(final UUID milkmanCustomerId, final LocalDate orderDate, final String remark) throws Exception {
        MilkmanCustomer mc = milkmanCustomerRepository
                .findById(milkmanCustomerId)
                .orElseThrow(() -> new Exception("Customer not linked to Milkman"));
        List<MilkOrder> orders = orderRepository.findByMilkmanCustomerAndOrderDate(mc, orderDate);
        System.out.println("Orders to moved to history table : " + orders.stream().toString());
        if(orders.isEmpty()){
            MilkOrder order = new MilkOrder();
            order.setMilkmanCustomer(mc);
            order.setOrderDate(orderDate);
            double qty = mc.getCustomer().getDefaultMilkQty();
            order.setQuantity(qty);
            order.setNote("Default order");
            order.setRate(mc.getMilkRate());
            order.setAmount(qty * order.getRate());
            order.setCreatedAt(LocalDateTime.now());
            order.setStatus("PENDING");
            order = orderRepository.save(order);


            double orderAmount = qty * order.getRate();
            double updatedDueAmount = mc.getDueAmount() + orderAmount;
            int updatedRow = milkmanCustomerRepository.updateCustomerDueAmount(milkmanCustomerId, updatedDueAmount, LocalDateTime.now());
            System.out.println("confirmOrderDelivery : "  + updatedRow);
            updateDeliveryStatusAndMoveToHistory(order, "DELIVERED", remark);
        }else{
            for(MilkOrder order : orders){
                updateDeliveryStatusAndMoveToHistory(order, "DELIVERED", remark);
            }
        }
    }

    @Transactional
    public void cancelOrderDelivery(final UUID milkmanCustomerId, final LocalDate orderDate, final String remark) throws Exception {
        MilkmanCustomer mc = milkmanCustomerRepository
                .findById(milkmanCustomerId)
                .orElseThrow(() -> new Exception("Customer not linked to Milkman"));
        List<MilkOrder> orders = orderRepository.findByMilkmanCustomerAndOrderDate(mc, orderDate);
        System.out.println("Orders to moved to history table : " + orders.stream().toString());
        if(orders.isEmpty()){
            MilkOrder order = new MilkOrder();
            order.setMilkmanCustomer(mc);
            order.setOrderDate(orderDate);
            double qty = mc.getCustomer().getDefaultMilkQty();
            order.setQuantity(qty);
            order.setNote("Default order");
            order.setRate(mc.getMilkRate());
            order.setAmount(qty * order.getRate());
            order.setCreatedAt(LocalDateTime.now());
            order.setStatus("PENDING");
            order = orderRepository.save(order);
            updateDeliveryStatusAndMoveToHistory(order, "NOT DELIVERED", remark);
        }else{
            for(MilkOrder order : orders){
                double orderAmount = order.getQuantity() * order.getRate();
                double updatedDueAmount = mc.getDueAmount() - orderAmount;
                int updatedRow = milkmanCustomerRepository.updateCustomerDueAmount(milkmanCustomerId, updatedDueAmount, LocalDateTime.now());
                System.out.println("cancelOrderDelivery : "  + updatedRow);
                updateDeliveryStatusAndMoveToHistory(order, "NOT DELIVERED", remark);
            }
        }
    }

    private void updateDeliveryStatusAndMoveToHistory(final MilkOrder order, final String status, final String remark){
        try{
            int updatedRow = orderRepository.updateOrderStatus(order.getId(), status);
            if(updatedRow == 0){
                throw new RuntimeException("Order not found or status update failed");
            }
            OrderHistory history = new OrderHistory();
            history.setMilkOrder(order);
            history.setDeliveryDate(LocalDateTime.now());
            history.setStatus(status);
            history.setRemark(remark);
            orderHistoryRepository.save(history);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
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
