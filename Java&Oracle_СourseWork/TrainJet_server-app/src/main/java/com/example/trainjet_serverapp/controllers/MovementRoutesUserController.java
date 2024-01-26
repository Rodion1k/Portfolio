package com.example.trainjet_serverapp.controllers;

import com.example.trainjet_serverapp.request.models.MovementRouteRequest;
import com.example.trainjet_serverapp.services.implementation.MovementRoutesService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/user/route")
public class MovementRoutesUserController {
    private final MovementRoutesService movementRoutesService;


    public MovementRoutesUserController(MovementRoutesService movementRoutesService) {
        this.movementRoutesService = movementRoutesService;
    }

    @GetMapping("/getStations")
    @Async
    public CompletableFuture<ResponseEntity<?>> getStations(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(movementRoutesService.getStationsAsync(itemFrom, itemTo).join()));
    }

    @GetMapping("/getRoutes")
    @Async
    public CompletableFuture<ResponseEntity<?>> getRoutes(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(movementRoutesService.getRoutesAsync(itemFrom, itemTo).join()));
    }

    @GetMapping("/getFlights")
    @Async
    public CompletableFuture<ResponseEntity<?>> getFlights(@RequestParam Integer itemFrom, @RequestParam Integer itemTo) {
        return CompletableFuture.completedFuture(ResponseEntity.ok(movementRoutesService.getFlightsAsync(itemFrom, itemTo).join()));
    }

    //TODO get trainFlights

}
