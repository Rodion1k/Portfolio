package com.example.trainjet_serverapp.models;

import com.example.trainjet_serverapp.request.models.StationRoute;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

public class MovementRouteRow {
    private String routeId;
    private String routeName;
    private String stationName;
    private Integer positionNumber;
    private Date positionDate;
    private Time positionTime;

    public Time getPositionTime() {
        return positionTime;
    }

    public void setPositionTime(Time positionTime) {
        this.positionTime = positionTime;
    }

    public static List<MovementRoute> toMovementRoutes(List<MovementRouteRow> routes) {
        List<MovementRoute> movementRoutes = new ArrayList<>();
        MovementRoute movementRoute = new MovementRoute();

        for (int i = 0; i < routes.size(); ) {
            movementRoute.setRouteId(routes.get(i).getRouteId());
            movementRoute.setRouteName(routes.get(i).getRouteName());
            List<StationRoute> stationRoutes = new ArrayList<>();
            while (i < routes.size() && routes.get(i).getRouteId().equals(movementRoute.getRouteId())) {
                StationRoute stationRoute = new StationRoute();
                stationRoute.setStationId(routes.get(i).getStationName());
                stationRoute.setPositionNumber(routes.get(i).getPositionNumber().toString());
                stationRoute.setPositionTime(routes.get(i).getPositionDate());
                stationRoutes.add(stationRoute);
                i++;
            }
            movementRoute.setStationRoutes(stationRoutes);
            movementRoutes.add(movementRoute);
            movementRoute = new MovementRoute();
        }

        return movementRoutes;
    }

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

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public Integer getPositionNumber() {
        return positionNumber;
    }

    public void setPositionNumber(Integer positionNumber) {
        this.positionNumber = positionNumber;
    }

    public Date getPositionDate() {
        return positionDate;
    }

    public void setPositionDate(Date positionDate) {
        this.positionDate = positionDate;
    }
}
