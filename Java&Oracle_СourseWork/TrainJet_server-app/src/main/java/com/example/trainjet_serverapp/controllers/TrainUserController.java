package com.example.trainjet_serverapp.controllers;

import com.example.trainjet_serverapp.services.implementation.TrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/user/train")
public class TrainUserController {
    private final TrainService trainService;

    public TrainUserController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/getTrainTypes")
    @Async
    public CompletableFuture<ResponseEntity<?>> getTrainTypes(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(trainService.getTrainTypesAsync(itemFrom,itemTo).join()));
    }

    @GetMapping("/getTrains")
    @Async
    public CompletableFuture<ResponseEntity<?>> getTrains(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(trainService.getTrainsAsync(itemFrom,itemTo).join()));
    }

    @GetMapping("/getWaggonTypes")
    @Async
    public CompletableFuture<ResponseEntity<?>> getWaggonTypes(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(trainService.getWaggonTypesAsync(itemFrom,itemTo).join()));
    }

    @GetMapping("/getTrainInfo")
    @Async
    public CompletableFuture<ResponseEntity<?>> getTrainInfo(@RequestParam String trainName,@RequestParam String routeId) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(trainService.getTrainInfoAsync(trainName,routeId).join()));
    }

    @GetMapping("/getSeats")
    @Async
    public CompletableFuture<ResponseEntity<?>> getSeats(@RequestParam String waggonId,@RequestParam String trainName,@RequestParam String routeId) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(trainService.getSeatsAsync(waggonId,trainName,routeId).join()));
    }
}
