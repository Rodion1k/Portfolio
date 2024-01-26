package com.example.trainjet_serverapp.controllers;

import com.example.trainjet_serverapp.models.Station;
import com.example.trainjet_serverapp.request.models.FlightRequest;
import com.example.trainjet_serverapp.request.models.MovementRouteRequest;
import com.example.trainjet_serverapp.response.models.BadRequestMessage;
import com.example.trainjet_serverapp.response.models.SuccessResponse;
import com.example.trainjet_serverapp.services.implementation.MovementRoutesService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/admin/route")
public class MovementRoutesAdminController {
    private final MovementRoutesService movementRoutesService;

    public MovementRoutesAdminController(MovementRoutesService movementRoutesService) {
        this.movementRoutesService = movementRoutesService;
    }

    @PostMapping("/addRoute")
    @Async
    public CompletableFuture<ResponseEntity<?>> addRoute(@RequestBody MovementRouteRequest model) {
        Boolean result = movementRoutesService.addRouteAsync(model).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Route added")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Route already exist")));
    }

    @PostMapping("/addStation")
    @Async //TODO проверить
    public CompletableFuture<ResponseEntity<?>> addStation(@RequestBody Station model) {
        Boolean result = movementRoutesService.addStationAsync(model.getName()).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Station added")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Station already exist")));
    }
    @PutMapping("/updateTime")
    @Async
    public CompletableFuture<ResponseEntity<?>> updateTime(@RequestParam Long newTime, @RequestParam String stationName) {
        Boolean result = movementRoutesService.updateTimeAsync(newTime,stationName).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Time updated")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Time not updated")));
    }

    @PostMapping("/addFlight")
    @Async
    public CompletableFuture<ResponseEntity<?>> addTrainToRoute(@RequestBody FlightRequest model) {
        Boolean result = movementRoutesService.createFlightAsync(model).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Train added to route")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Train already exist in route")));
    }

    @DeleteMapping("/deleteFlight")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteTrainFromRoute(@RequestParam String routeId) {
        Boolean result = movementRoutesService.deleteFlightAsync(routeId).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Train deleted from route")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Train not exist in route")));
    }

    @DeleteMapping("/deleteStationFromRoute")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteStationFromRoute(@RequestParam String routeId, @RequestParam String stationName) {
        Boolean result = movementRoutesService.deleteStationFromRouteAsync(routeId, stationName).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Station deleted from route")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Station not exist in route")));
    }

    @DeleteMapping("/deleteTrainFromRoute")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteTrainFromRoute(@RequestParam String routeId, @RequestParam String trainName) {
        Boolean result = movementRoutesService.deleteTrainFromRouteAsync(routeId, trainName).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Train deleted from route")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Train not exist in route")));
    }
}
