package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.MovementRouteRow;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;

public class MovementRouteMapper implements RowMapper<MovementRouteRow> {
    @Override
    public MovementRouteRow mapRow(ResultSet rs, int rowNum) throws SQLException {
        MovementRouteRow movementRouterow = new MovementRouteRow();
        movementRouterow.setRouteId(rs.getString("route_id"));
        movementRouterow.setRouteName(rs.getString("route_name"));
        movementRouterow.setStationName(rs.getString("station_name"));
        movementRouterow.setPositionNumber(rs.getInt("position_number"));
        movementRouterow.setPositionTime(rs.getTime("position_time"));
        movementRouterow.setPositionDate(rs.getDate("position_time"));
        return movementRouterow;
    }
}
