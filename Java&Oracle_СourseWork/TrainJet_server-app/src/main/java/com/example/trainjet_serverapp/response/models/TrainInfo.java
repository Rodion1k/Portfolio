package com.example.trainjet_serverapp.response.models;

public class TrainInfo {
    private String trainType;
    private String trainName;
    private Float trainTypeCoast;
    private String waggonId;
    private String waggonName;
    private String waggonType;
    private Integer waggonSize;
    private Float waggonCoast;
    private String routeId;

    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public String getTrainType() {
        return trainType;
    }

    public void setTrainType(String trainType) {
        this.trainType = trainType;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public Float getTrainTypeCoast() {
        return trainTypeCoast;
    }

    public void setTrainTypeCoast(Float trainTypeCoast) {
        this.trainTypeCoast = trainTypeCoast;
    }

    public String getWaggonId() {
        return waggonId;
    }

    public void setWaggonId(String waggonId) {
        this.waggonId = waggonId;
    }

    public String getWaggonName() {
        return waggonName;
    }

    public void setWaggonName(String waggonName) {
        this.waggonName = waggonName;
    }

    public String getWaggonType() {
        return waggonType;
    }

    public void setWaggonType(String waggonType) {
        this.waggonType = waggonType;
    }

    public Integer getWaggonSize() {
        return waggonSize;
    }

    public void setWaggonSize(Integer waggonSize) {
        this.waggonSize = waggonSize;
    }

    public Float getWaggonCoast() {
        return waggonCoast;
    }

    public void setWaggonCoast(Float waggonCoast) {
        this.waggonCoast = waggonCoast;
    }

}
