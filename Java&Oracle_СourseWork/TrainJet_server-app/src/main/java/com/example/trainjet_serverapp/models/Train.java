package com.example.trainjet_serverapp.models;

public class Train {
    private String id;
    private String name;
    private String trainType;

    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getTrainType() {
        return trainType;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTrainType(String trainType) {
        this.trainType = trainType;
    }
}
