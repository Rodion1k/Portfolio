package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.models.MovementRoute;
import com.example.trainjet_serverapp.models.MovementRouteRow;
import com.example.trainjet_serverapp.models.Station;
import com.example.trainjet_serverapp.models.TrainFlight;
import com.example.trainjet_serverapp.repositories.movementRoutes.MovementRoutesAdminRepository;
import com.example.trainjet_serverapp.repositories.movementRoutes.MovementRoutesUserRepository;
import com.example.trainjet_serverapp.request.models.FlightRequest;
import com.example.trainjet_serverapp.request.models.MovementRouteRequest;
import com.example.trainjet_serverapp.services.interfaces.IMovementRoutesService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class MovementRoutesService implements IMovementRoutesService {

    private final MovementRoutesAdminRepository movementRoutesAdminRepository;
    private final MovementRoutesUserRepository movementRoutesUserRepository;

    public MovementRoutesService(MovementRoutesAdminRepository movementRoutesAdminRepository,
                                 MovementRoutesUserRepository movementRoutesUserRepository) {
        this.movementRoutesAdminRepository = movementRoutesAdminRepository;
        this.movementRoutesUserRepository = movementRoutesUserRepository;
    }

    @Async
    @Override
    public CompletableFuture<List<Station>> getStationsAsync(Integer itemFrom, Integer itemTo) {
        return movementRoutesUserRepository.getStations(itemFrom, itemTo);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> addStationAsync(String station) {
        return movementRoutesAdminRepository.addStation(station);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> deleteStationAsync(String id) {
        return movementRoutesAdminRepository.deleteStationById(id);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> addRouteAsync(MovementRouteRequest route) {
        return movementRoutesAdminRepository.addMovementRoute(route);
    }

    @Async
    @Override
    public CompletableFuture<List<MovementRouteRow>> getRoutesAsync(Integer itemFrom, Integer itemTo) {
        return movementRoutesUserRepository.getRoutes(itemFrom, itemTo);
    }

    @Async
    @Override
    public CompletableFuture<List<TrainFlight>> getFlightsAsync(Integer itemFrom, Integer itemTo) {
        return movementRoutesUserRepository.getFlights(itemFrom, itemTo);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> createFlightAsync(FlightRequest flight) {
        return movementRoutesAdminRepository.createFlight(flight);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> deleteFlightAsync(String routeId) {
        return movementRoutesAdminRepository.deleteFlight(routeId);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> deleteStationFromRouteAsync(String routeId, String stationName) {
        return movementRoutesAdminRepository.deleteStationFromRoute(routeId, stationName);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> deleteTrainFromRouteAsync(String routeId, String trainName) {
        return movementRoutesAdminRepository.deleteTrainFromRoute(routeId, trainName);
    }

    @Async
    @Override
    public CompletableFuture<Boolean> updateTimeAsync(Long newTime, String stationName) {
        return movementRoutesAdminRepository.updateTime(newTime, stationName);
    }


}
