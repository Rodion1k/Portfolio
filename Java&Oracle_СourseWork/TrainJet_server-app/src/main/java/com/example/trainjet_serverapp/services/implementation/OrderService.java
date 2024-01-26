package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.models.Seat;
import com.example.trainjet_serverapp.repositories.OrderRepository;
import com.example.trainjet_serverapp.request.models.OrderRequest;
import com.example.trainjet_serverapp.response.models.OnlyOrdersResponse;
import com.example.trainjet_serverapp.response.models.OrderResponse;
import com.example.trainjet_serverapp.response.models.StatisticResponse;
import com.example.trainjet_serverapp.services.interfaces.IOrderService;
import nonapi.io.github.classgraph.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class OrderService implements IOrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Async
    public CompletableFuture<Boolean> addOrderAsync(String userId, OrderRequest order) {
        String orderId = orderRepository.addOrder(userId, order).join();
        List<Seat> seats = order.getSelectedSeats();
        orderRepository.addSeatToOrder(orderId, seats).join();
        return CompletableFuture.completedFuture(true);
    }

    @Override
    @Async
    public CompletableFuture<List<OrderResponse>> getUserCartOrders(String userId, Character status) {
        return orderRepository.getUserCartOrders(userId, status);
    }

    @Override
    @Async
    public CompletableFuture<Boolean> deleteOrder(String orderId) {
        return orderRepository.deleteOrder(orderId);
    }

    @Override
    @Async
    public CompletableFuture<Boolean> confirmOrder(String orderId) {
        return orderRepository.confirmOrder(orderId);
    }

    @Override
    @Async
    public CompletableFuture<List<OrderResponse>> getConfirmedOrders(Long dateFrom, Long dateTo) {
        return orderRepository.getConfirmedOrders(dateFrom, dateTo);
    }

    @Override
    @Async
    public CompletableFuture<List<StatisticResponse>> getStatistics(Long dateFrom, Long dateTo) {
        return orderRepository.getStatistics(dateFrom, dateTo);
    }
    @Override
    @Async
    public CompletableFuture<List<OnlyOrdersResponse>> getAllOrders(Integer itemFrom, Integer itemTo) {
        return orderRepository.getAllOrders(itemFrom, itemTo);
    }
}
