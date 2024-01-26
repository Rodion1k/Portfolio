package com.example.trainjet_serverapp.models;

public class Seat {
    private String id;
    private Integer seatNumber;
    private String waggon;
    private Character isBought;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getWaggon() {
        return waggon;
    }

    public void setWaggon(String waggon) {
        this.waggon = waggon;
    }

    public Character getIsBought() {
        return isBought;
    }

    public void setIsBought(Character isBought) {
        this.isBought = isBought;
    }
}
