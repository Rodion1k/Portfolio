package com.example.trainjet_serverapp.services.interfaces;

import com.example.trainjet_serverapp.models.Seat;
import com.example.trainjet_serverapp.models.Train;
import com.example.trainjet_serverapp.models.TrainType;
import com.example.trainjet_serverapp.models.WaggonType;
import com.example.trainjet_serverapp.request.models.TrainRequest;
import com.example.trainjet_serverapp.request.models.TrainTypeRequest;
import com.example.trainjet_serverapp.request.models.WaggonRequest;
import com.example.trainjet_serverapp.response.models.TrainInfo;
import com.example.trainjet_serverapp.response.models.TrainTypeResponse;

import java.util.List;
import java.util.concurrent.CompletableFuture;


public interface ITrainService {
    CompletableFuture<Boolean> addTrainAsync(TrainRequest train);
    CompletableFuture<Boolean> deleteTrainAsync(String id);

    CompletableFuture<Boolean> addTrainTypeAsync(TrainTypeRequest trainType);

    CompletableFuture<Boolean> addWaggonTypeAsync(WaggonRequest waggonType);

    CompletableFuture<TrainType> getTrainTypeAsync(String trainType);

    CompletableFuture<List<TrainType>> getTrainTypesAsync(Integer itemFrom,Integer itemTo);

    CompletableFuture<List<Train>> getTrainsAsync(Integer itemFrom,Integer itemTo);
    CompletableFuture<List<TrainTypeResponse>> updateTrainTypesAsync(List<TrainTypeRequest> trainTypes);

    CompletableFuture<List<WaggonType>> getWaggonTypesAsync(Integer itemFrom,Integer itemTo);

    CompletableFuture<List<TrainInfo>> getTrainInfoAsync(String trainName, String routeId);

    CompletableFuture<List<Seat>> getSeatsAsync(String trainId, String routeId, String waggonId);
}
