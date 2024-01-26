package com.example.trainjet_serverapp.request.models;

public class TrainTypeRequest {
    private String trainType;
    private Float price;

    public String getTrainType() {
        return trainType;
    }

    public Float getPrice() {
        return price;
    }

    public void setTrainType(String trainType) {
        this.trainType = trainType;
    }

    public void setPrice(String price) {
        this.price = Float.parseFloat(price);
    }
}
