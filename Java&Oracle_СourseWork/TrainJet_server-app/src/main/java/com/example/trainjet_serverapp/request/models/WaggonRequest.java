package com.example.trainjet_serverapp.request.models;

public class WaggonRequest {
    private String name;
    private Float price;
    private Integer size;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = Float.parseFloat(price);
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = Integer.parseInt(size);
    }
}
