package com.milkman.service;

import com.milkman.DAO.OrderServiceDAO;
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

    @Autowired
    public OrderServiceDAO orderServiceDAO;

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
            return orderServiceDAO.getTodaysOrdersByMilkman(milkmanId);
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
            MilkmanCustomer mc = associationOpt.get();
            mc.setDueAmount(updatedDueAmount);
            mc.setLastUpdated(LocalDateTime.now());
            milkmanCustomerRepository.save(mc);
            return savedOrder.getId();
        }catch (Exception ex){
            System.err.println("Failed to save Order: " + ex.getMessage());
            throw new RuntimeException("Unable to save order record", ex);
        }
    }


    @Transactional
    public void confirmOrderDelivery(final UUID orderId, final LocalDate orderDate, final String remark) throws Exception {
        try{
            MilkOrder mo = orderRepository.findById(orderId).orElseThrow(() -> new Exception("Invalid orderId"));
            System.out.println("Order found" + mo.toString());
            updateDeliveryStatusAndMoveToHistory(mo, "DELIVERED", remark);
        }catch (Exception ex){
            System.err.println("Failed to update confirm order delivery: " + ex.getMessage());
            throw new RuntimeException("Failed to update confirm order delivery", ex);
        }
    }

    @Transactional
    public void cancelOrderDelivery(final UUID orderId, final LocalDate orderDate, final String remark) throws Exception {
        try{
            MilkOrder mo = orderRepository.findById(orderId).orElseThrow(() -> new Exception("Invalid orderId"));
            System.out.println("Order found" + mo.toString());
            MilkmanCustomer mc = mo.getMilkmanCustomer();
            double orderAmount = mo.getQuantity() * mo.getRate();
            double updatedDueAmount = mc.getDueAmount() - orderAmount;
            mc.setLastUpdated(LocalDateTime.now());
            mc.setDueAmount(updatedDueAmount);
            milkmanCustomerRepository.save(mc);
            updateDeliveryStatusAndMoveToHistory(mo, "NOT DELIVERED", remark);
        }catch (Exception ex){
            System.err.println("Failed to update cancel order delivery: " + ex.getMessage());
            throw new RuntimeException("Failed to update cancel order delivery", ex);
        }

    }

    private void updateDeliveryStatusAndMoveToHistory(final MilkOrder order, final String status, final String remark){
        try{
            order.setStatus(status);
            orderRepository.save(order);

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
