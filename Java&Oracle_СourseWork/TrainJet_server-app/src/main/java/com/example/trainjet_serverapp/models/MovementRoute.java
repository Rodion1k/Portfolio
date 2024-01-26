package com.example.trainjet_serverapp.models;

import com.example.trainjet_serverapp.request.models.StationRoute;

import java.util.ArrayList;
import java.util.List;

public class MovementRoute {
    private String routeId;
    private String routeName;
    private List<StationRoute> stationRoutes=new ArrayList<>();

    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public List<StationRoute> getStationRoutes() {
        return stationRoutes;
    }

    public void setStationRoutes(List<StationRoute> stationRoutes) {
        this.stationRoutes = stationRoutes;
    }
}
