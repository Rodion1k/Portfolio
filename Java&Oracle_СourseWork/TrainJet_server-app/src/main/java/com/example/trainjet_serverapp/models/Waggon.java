package com.example.trainjet_serverapp.models;

public class Waggon {
    private Integer waggonNumber;
    private String waggonType;

    public Integer getWaggonNumber() {
        return waggonNumber;
    }

    public void setWaggonNumber(String waggonNumber) {
        this.waggonNumber = Integer.parseInt(waggonNumber);
    }

    public String getWaggonType() {
        return waggonType;
    }

    public void setWaggonType(String waggonType) {
        this.waggonType = waggonType;
    }
}
