package com.example.trainjet_serverapp.models;

import java.sql.Date;
import java.sql.Time;

public class TrainFlight {
    private String trainName;
    private String routeId;
    private String routeName;
    private String stationName;
    private Integer positionNumber;
    private Date positionDate;
    private Time positionTime;

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
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

    public Time getPositionTime() {
        return positionTime;
    }

    public void setPositionTime(Time positionTime) {
        this.positionTime = positionTime;
    }
}
