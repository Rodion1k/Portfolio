package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.models.*;
import com.example.trainjet_serverapp.repositories.train.TrainAdminRepository;
import com.example.trainjet_serverapp.repositories.train.TrainUserRepository;
import com.example.trainjet_serverapp.request.models.TrainRequest;
import com.example.trainjet_serverapp.request.models.TrainTypeRequest;
import com.example.trainjet_serverapp.request.models.WaggonRequest;
import com.example.trainjet_serverapp.response.models.TrainInfo;
import com.example.trainjet_serverapp.response.models.TrainTypeResponse;
import com.example.trainjet_serverapp.services.interfaces.ITrainService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class TrainService implements ITrainService {

    private final TrainAdminRepository trainAdminRepository;
    private final TrainUserRepository trainUserRepository;

    public TrainService(TrainAdminRepository trainAdminRepository, TrainUserRepository trainUserRepository) {
        this.trainAdminRepository = trainAdminRepository;
        this.trainUserRepository = trainUserRepository;
    }

    @Override
    @Async
    public CompletableFuture<Boolean> addTrainAsync(TrainRequest train) {
        TrainType trainTypeResult = trainAdminRepository.getTrainTypeByName(train.getTrainType()).join();
        if (trainTypeResult == null) {
            return CompletableFuture.completedFuture(false);
        }
        Train trainRes = trainAdminRepository.getTrainByName(train.getName()).join();
        if (trainRes != null) {
            return CompletableFuture.completedFuture(false);
        }
        String id = trainAdminRepository.addTrain(train).join();
        List<Waggon> waggons = train.getWaggons();
        for (Waggon waggon : waggons) {
            trainAdminRepository.addWaggon(waggon, id).join();
        }
        return CompletableFuture.completedFuture(true);
    }

    @Override
    public CompletableFuture<Boolean> deleteTrainAsync(String id) {
        return trainAdminRepository.deleteTrain(id);
    }

    @Override
    @Async
    public CompletableFuture<Boolean> addTrainTypeAsync(TrainTypeRequest trainType) {
        CompletableFuture<TrainType> trainTypeResult = trainAdminRepository.getTrainTypeByName(trainType.getTrainType());
        if (trainTypeResult.join() != null) {
            return CompletableFuture.completedFuture(false);
        }
        Boolean result = trainAdminRepository.addTrainType(trainType).join();
        return CompletableFuture.completedFuture(result);
    }

    @Override
    @Async
    public CompletableFuture<Boolean> addWaggonTypeAsync(WaggonRequest waggonType) {
        CompletableFuture<WaggonType> waggonTypeResult = trainAdminRepository.getWaggonTypeByName(waggonType.getName());
        if (waggonTypeResult.join() != null) {
            return CompletableFuture.completedFuture(false);
        }
        Boolean result = trainAdminRepository.addWaggonType(waggonType).join();
        return CompletableFuture.completedFuture(result);
    }

    @Override
    @Async
    public CompletableFuture<TrainType> getTrainTypeAsync(String trainType) {
        CompletableFuture<TrainType> trainTypeResult = trainAdminRepository.getTrainTypeByName(trainType);
        if (trainTypeResult.join() == null) {
            return CompletableFuture.completedFuture(null);
        }
        return CompletableFuture.completedFuture(trainTypeResult.join());
    }

    @Override
    @Async
    public CompletableFuture<List<TrainType>> getTrainTypesAsync(Integer itemFrom, Integer itemTo) {
        return trainUserRepository.getTrainTypes(itemFrom, itemTo);
    }

    @Override
    @Async
    public CompletableFuture<List<Train>> getTrainsAsync(Integer itemFrom, Integer itemTo) {
        return trainUserRepository.getTrains(itemFrom, itemTo);
    }

    @Override
    @Async
    public CompletableFuture<List<TrainTypeResponse>> updateTrainTypesAsync(List<TrainTypeRequest> trainTypes) {
        List<TrainTypeResponse> trainTypeResponses = new ArrayList<>();
        for (TrainTypeRequest trainType : trainTypes) { // TODO передалить
            CompletableFuture<TrainType> trainTypeResult = trainAdminRepository.getTrainTypeByName(trainType.getTrainType());
            TrainType trainTypeRes = trainTypeResult.join();
            if (trainTypeRes == null) {
                trainTypeResponses.add(new TrainTypeResponse(trainType.getTrainType(), false));
            } else {
                trainTypeRes.setPrice(trainType.getPrice());
                trainTypeRes.setTrainType(trainType.getTrainType());
                Boolean result = trainAdminRepository.updateTrainTypeById(trainTypeRes).join();
                trainTypeResponses.add(new TrainTypeResponse(trainTypeRes.getId(), result));
            }
        }
        return CompletableFuture.completedFuture(trainTypeResponses);
    }

    @Override
    @Async
    public CompletableFuture<List<WaggonType>> getWaggonTypesAsync(Integer itemFrom, Integer itemTo) {
        return trainUserRepository.getWaggonTypes(itemFrom, itemTo);
    }

    @Override
    public CompletableFuture<List<TrainInfo>> getTrainInfoAsync(String trainName, String routeId) {
        return trainUserRepository.getTrainInfo(trainName, routeId);
    }

    @Override
    public CompletableFuture<List<Seat>> getSeatsAsync(String trainId, String routeId, String waggonId) {
        return trainUserRepository.getSeats(trainId, routeId, waggonId);
    }
}
