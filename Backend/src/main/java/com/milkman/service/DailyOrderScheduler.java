package com.milkman.service;

import com.milkman.model.MilkOrder;
import com.milkman.model.MilkmanCustomer;
import com.milkman.model.OrderHistory;
import com.milkman.repository.MilkmanCustomerRepository;
import com.milkman.repository.OrderHistoryRepository;
import com.milkman.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DailyOrderScheduler {
    private final OrderRepository orderRepo;
    private final OrderHistoryRepository historyRepo;
    private final MilkmanCustomerRepository userRepo;

    public DailyOrderScheduler(
            OrderRepository orderRepo,
            OrderHistoryRepository historyRepo,
            MilkmanCustomerRepository userRepo
    ) {
        this.orderRepo   = orderRepo;
        this.historyRepo = historyRepo;
        this.userRepo    = userRepo;
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "America/Los_Angeles")
    @Transactional
    public void rollOverOrders() {
        LocalDate today     = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        archivePendingOrders(yesterday);
        createDefaultOrdersForToday(today);
    }

    private void archivePendingOrders(LocalDate date) {
        List<MilkOrder> pending = orderRepo.findByStatusAndOrderDate("PENDING", date);

        for (MilkOrder o : pending) {
            // 1. Mark as NOT_DELIVERED
            o.setStatus("NOT_DELIVERED");
            orderRepo.save(o);

            // 2. Copy to history
            OrderHistory hist = new OrderHistory();
            hist.setMilkOrder(o);
            hist.setDeliveryDate(o.getOrderDate().atStartOfDay());
            hist.setStatus(o.getStatus());
            hist.setRemark("Order skipped and archived");
            historyRepo.save(hist);

            // 3. Update user’s due amount
            MilkmanCustomer mc = o.getMilkmanCustomer();
            double updatedDueAmount = mc.getDueAmount() - o.getAmount();
            mc.setDueAmount(updatedDueAmount);
            mc.setLastUpdated(LocalDateTime.now());
            userRepo.save(mc);
        }
    }

    private void createDefaultOrdersForToday(LocalDate date) {
        List<MilkmanCustomer> allUsers = userRepo.findAll();

        for (MilkmanCustomer u : allUsers) {
            double qty = u.getCustomer().getDefaultMilkQty();
            double amt = u.getMilkRate() * qty;

            // 1. Create a new pending order
            MilkOrder newOrder = new MilkOrder();
            newOrder.setMilkmanCustomer(u);
            newOrder.setOrderDate(date);
            newOrder.setQuantity(qty);
            newOrder.setAmount(amt);
            newOrder.setStatus("PENDING");
            newOrder.setNote("Default Order");
            newOrder.setRate(u.getMilkRate());
            newOrder.setCreatedAt(LocalDateTime.now());
            orderRepo.save(newOrder);

            // 2. Update user’s due
            double updatedDueAmount = u.getDueAmount() + amt;
            u.setDueAmount(updatedDueAmount);
            u.setLastUpdated(LocalDateTime.now());
            userRepo.save(u);
        }
    }
}
