package com.example.trainjet_serverapp.request.models;

import java.util.Date;

public class StationRoute {
    private String stationId;
    private Integer positionNumber;
    private Date positionTime;

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public Integer getPositionNumber() {
        return positionNumber;
    }

    public void setPositionNumber(String positionNumber) {
        this.positionNumber = Integer.parseInt(positionNumber);
    }

    public Date getPositionTime() {
        return positionTime;
    }

    public void setPositionTime(Date positionTime) {
        this.positionTime = positionTime;
    }
}
