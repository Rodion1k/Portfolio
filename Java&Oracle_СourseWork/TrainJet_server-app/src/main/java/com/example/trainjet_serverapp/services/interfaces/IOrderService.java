package com.example.trainjet_serverapp.services.interfaces;

import com.example.trainjet_serverapp.request.models.OrderRequest;
import com.example.trainjet_serverapp.response.models.OnlyOrdersResponse;
import com.example.trainjet_serverapp.response.models.OrderResponse;
import com.example.trainjet_serverapp.response.models.StatisticResponse;
import nonapi.io.github.classgraph.utils.StringUtils;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IOrderService {
    CompletableFuture<Boolean> addOrderAsync(String userId, OrderRequest order);
    CompletableFuture<List<OrderResponse>> getUserCartOrders(String userId,Character status);

    CompletableFuture<Boolean> deleteOrder(String orderId);

    CompletableFuture<Boolean> confirmOrder(String orderId);

    CompletableFuture<List<OrderResponse>> getConfirmedOrders(Long dateFrom, Long dateTo);

    CompletableFuture<List<StatisticResponse>> getStatistics(Long dateFrom, Long dateTo);
    CompletableFuture<List<OnlyOrdersResponse>> getAllOrders(Integer itemFrom, Integer itemTo);
}
