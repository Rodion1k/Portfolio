package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.Station;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StationMapper implements RowMapper<Station> {

    @Override
    public Station mapRow(ResultSet rs, int rowNum) throws SQLException {
        Station station =new Station();
        station.setId(rs.getString("station_id"));
        station.setName(rs.getString("station_name"));
        return station;
    }
}
