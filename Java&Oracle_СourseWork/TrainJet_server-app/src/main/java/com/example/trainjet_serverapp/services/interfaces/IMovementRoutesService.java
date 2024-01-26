package com.example.trainjet_serverapp.services.interfaces;

import com.example.trainjet_serverapp.models.MovementRoute;
import com.example.trainjet_serverapp.models.MovementRouteRow;
import com.example.trainjet_serverapp.models.Station;
import com.example.trainjet_serverapp.models.TrainFlight;
import com.example.trainjet_serverapp.request.models.FlightRequest;
import com.example.trainjet_serverapp.request.models.MovementRouteRequest;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IMovementRoutesService {
    CompletableFuture<List<Station>> getStationsAsync(Integer itemFrom, Integer itemTo);

    CompletableFuture<Boolean> addStationAsync(String station);

    CompletableFuture<Boolean> deleteStationAsync(String id);
    CompletableFuture<Boolean> addRouteAsync(MovementRouteRequest route);
    CompletableFuture<List<MovementRouteRow>> getRoutesAsync(Integer itemFrom, Integer itemTo);
    CompletableFuture<List<TrainFlight>> getFlightsAsync(Integer itemFrom, Integer itemTo);

    CompletableFuture<Boolean> createFlightAsync(FlightRequest flight);
    CompletableFuture<Boolean> deleteFlightAsync(String routeId);
    CompletableFuture<Boolean> deleteStationFromRouteAsync(String routeId,String stationName);
    CompletableFuture<Boolean> deleteTrainFromRouteAsync(String routeId,String trainName);
    CompletableFuture<Boolean> updateTimeAsync(Long newTime,String stationName);

}
