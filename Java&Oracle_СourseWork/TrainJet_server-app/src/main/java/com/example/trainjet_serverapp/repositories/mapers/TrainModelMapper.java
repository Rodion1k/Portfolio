package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.Train;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class TrainModelMapper implements RowMapper<Train> {
    @Override
    public Train mapRow(ResultSet rs, int rowNum) throws SQLException {
        Train train = new Train();
        train.setId(rs.getString("train_id"));
        train.setTrainType(rs.getString("train_type_id"));
        train.setName(rs.getString("train_name"));
        return train;
    }
}