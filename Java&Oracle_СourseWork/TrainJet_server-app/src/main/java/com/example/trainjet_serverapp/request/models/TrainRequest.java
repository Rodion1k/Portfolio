package com.example.trainjet_serverapp.request.models;

import com.example.trainjet_serverapp.models.Waggon;

import java.util.ArrayList;
import java.util.List;

public class TrainRequest {
    private String name;
    private String trainType;

    public List<Waggon> getWaggons() {
        return waggons;
    }

    public void setWaggons(List<Waggon> waggonList) {
        this.waggons = waggonList;
    }

    List<Waggon> waggons;
    public TrainRequest() {
        waggons = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public String getTrainType() {
        return trainType;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTrainType(String trainType) {
        this.trainType = trainType;
    }
}
