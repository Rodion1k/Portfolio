package com.example.trainjet_serverapp.controllers;

import com.example.trainjet_serverapp.request.models.OrderRequest;
import com.example.trainjet_serverapp.response.models.SuccessResponse;
import com.example.trainjet_serverapp.services.implementation.GenericModelService;
import com.example.trainjet_serverapp.services.implementation.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/user/generic")
public class GenericUserController {
    private final GenericModelService genericModelService;
    private final OrderService orderService;

    public GenericUserController(GenericModelService genericModelService, OrderService orderService) {
        this.genericModelService = genericModelService;
        this.orderService = orderService;
    }

    @GetMapping("/getCount")
    @Async
    public CompletableFuture<ResponseEntity<?>> getCount(@RequestParam String tableName) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(genericModelService.getSize(tableName).join()));
    }

    @GetMapping("/getUserInfo")
    @Async
    public CompletableFuture<ResponseEntity<?>> getUserInfo() {
        // TODO распарсить jwtToken
        return null;
    }

    @GetMapping("/getUserCartOrders")
    @Async
    public CompletableFuture<ResponseEntity<?>> getUserCartOrders(@RequestParam String userId, @RequestParam Character status) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(orderService.getUserCartOrders(userId, status).join()));
    }

    @GetMapping("/getConfirmedOrders")
    @Async
    public CompletableFuture<ResponseEntity<?>> getConfirmedOrders(@RequestParam Long dateFrom, @RequestParam Long dateTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(orderService.getConfirmedOrders(dateFrom,dateTo).join()));
    }

    @GetMapping("/getStatistics")
    @Async
    public CompletableFuture<ResponseEntity<?>> getStatistics(@RequestParam Long dateFrom, @RequestParam Long dateTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(orderService.getStatistics(dateFrom,dateTo).join()));
    }

    @PostMapping("/addOrder")
    @Async
    public CompletableFuture<ResponseEntity<?>> addOrder(@RequestBody OrderRequest orderRequest) {
        if (orderService.addOrderAsync(orderRequest.getUserId(), orderRequest).join()) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Order added successfully")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Order adding failed")));
    }

    @DeleteMapping("/deleteOrder")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteOrder(@RequestParam String orderId) {
        if (orderService.deleteOrder(orderId).join()) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Order deleted successfully")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Order deleting failed")));
    }

    @PutMapping("/confirmOrder")
    @Async
    public CompletableFuture<ResponseEntity<?>> confirmOrder(@RequestParam String orderId) {
        if (orderService.confirmOrder(orderId).join()) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Order confirmed successfully")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Order confirming failed")));
    }

    @GetMapping("/getAllOrders")
    @Async
    public CompletableFuture<ResponseEntity<?>> getAllOrders(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(orderService.getAllOrders(itemFrom, itemTo).join()));
    }

}
