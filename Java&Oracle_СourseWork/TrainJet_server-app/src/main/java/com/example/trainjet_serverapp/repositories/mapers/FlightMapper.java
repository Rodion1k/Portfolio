package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.TrainFlight;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FlightMapper implements RowMapper<TrainFlight> {
    @Override
    public TrainFlight mapRow(ResultSet rs, int rowNum) throws SQLException {
        TrainFlight trainFlight = new TrainFlight();
        trainFlight.setRouteId(rs.getString("route_id"));
        trainFlight.setTrainName(rs.getString("train_name"));
        trainFlight.setRouteName(rs.getString("route_name"));
        trainFlight.setStationName(rs.getString("station_name"));
        trainFlight.setPositionNumber(rs.getInt("position_number"));
        trainFlight.setPositionTime(rs.getTime("position_time"));
        trainFlight.setPositionDate(rs.getDate("position_time"));

        return trainFlight;
    }
}
