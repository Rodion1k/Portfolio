package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.TrainType;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TrainTypeMapper implements RowMapper<TrainType> {
    @Override
    public TrainType mapRow(ResultSet rs, int rowNum) throws SQLException {
        TrainType trainType = new TrainType();
        trainType.setId(rs.getString("train_type_id"));
        trainType.setTrainType(rs.getString("train_type"));
        trainType.setPrice(rs.getFloat("train_type_cost"));
        return trainType;
    }
}
