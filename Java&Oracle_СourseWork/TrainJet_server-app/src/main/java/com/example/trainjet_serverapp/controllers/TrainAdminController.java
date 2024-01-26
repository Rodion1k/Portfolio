package com.example.trainjet_serverapp.controllers;

import com.example.trainjet_serverapp.request.models.TrainRequest;
import com.example.trainjet_serverapp.request.models.TrainTypeRequest;
import com.example.trainjet_serverapp.request.models.WaggonRequest;
import com.example.trainjet_serverapp.response.models.BadRequestMessage;
import com.example.trainjet_serverapp.response.models.SuccessResponse;
import com.example.trainjet_serverapp.response.models.TrainTypeResponse;
import com.example.trainjet_serverapp.services.implementation.TrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/admin/train")
public class TrainAdminController {

    private final TrainService trainService;

    public TrainAdminController(TrainService trainService) {
        this.trainService = trainService;
    }


    @PostMapping("/addTrain")
    @Async
    public CompletableFuture<ResponseEntity<?>> addTrain(@RequestBody TrainRequest model) {
        Boolean result = trainService.addTrainAsync(model).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Train added")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Train already exist")));
    }

    // deleteTrain by id
    @DeleteMapping("/deleteTrain/{trainId}")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteTrain(@PathVariable String trainId) {
        Boolean result = trainService.deleteTrainAsync(trainId).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("Train deleted")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Train not found")));
    }

    @PostMapping("/addTrainType")
    @Async
    public CompletableFuture<ResponseEntity<?>> addTrainType(@RequestBody TrainTypeRequest model) {
        Boolean result = trainService.addTrainTypeAsync(model).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("TrainType added")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("TrainType already exist")));
    }

    @PostMapping("/addWaggonType")
    @Async
    public CompletableFuture<ResponseEntity<?>> addWaggonType(@RequestBody WaggonRequest model) {
        Boolean result = trainService.addWaggonTypeAsync(model).join();
        if (result) {
            return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("WaggonType added")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("WaggonType already exist")));
    }

    @PostMapping("/updateTrainTypes")
    @Async
    public CompletableFuture<ResponseEntity<?>> updateTrainTypes(@RequestBody List<TrainTypeRequest> models) {
        List<TrainTypeResponse> result = trainService.updateTrainTypesAsync(models).join();
        return CompletableFuture.completedFuture(ResponseEntity.ok(result));
    }


}
