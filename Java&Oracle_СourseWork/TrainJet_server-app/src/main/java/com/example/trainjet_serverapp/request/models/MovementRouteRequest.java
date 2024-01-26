package com.example.trainjet_serverapp.request.models;

import java.util.List;

public class MovementRouteRequest {
    private String name;
    private List<StationRoute> stationRoutes;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<StationRoute> getStationRoutes() {
        return stationRoutes;
    }

    public void setStationRoutes(List<StationRoute> stationRoutes) {
        this.stationRoutes = stationRoutes;
    }

}
