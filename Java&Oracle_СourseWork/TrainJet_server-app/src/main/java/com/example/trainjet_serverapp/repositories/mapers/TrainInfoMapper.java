package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.Train;
import com.example.trainjet_serverapp.response.models.TrainInfo;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TrainInfoMapper implements RowMapper<TrainInfo> {
    @Override
    public TrainInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
        TrainInfo trainInfo = new TrainInfo();
        trainInfo.setTrainType(rs.getString("train_type"));
        trainInfo.setTrainName(rs.getString("train_name"));
        trainInfo.setTrainTypeCoast(rs.getFloat("train_type_cost"));
        trainInfo.setWaggonId(rs.getString("waggon_id"));
        trainInfo.setWaggonName(rs.getString("waggon_name"));
        trainInfo.setWaggonType(rs.getString("waggon_type_name"));
        trainInfo.setWaggonSize(rs.getInt("waggon_type_size"));
        trainInfo.setWaggonCoast(rs.getFloat("waggon_type_cost"));
        trainInfo.setRouteId(rs.getString("movement_route_id"));
        return trainInfo;
    }
}
