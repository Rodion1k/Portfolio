package com.example.trainjet_serverapp.response.models;

import java.sql.Date;

public class StatisticResponse {
    Date date;
    Integer count;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
