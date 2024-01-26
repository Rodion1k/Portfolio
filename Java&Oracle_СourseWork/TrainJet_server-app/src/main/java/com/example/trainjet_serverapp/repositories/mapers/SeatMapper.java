package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.Seat;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SeatMapper implements RowMapper<Seat> {

    @Override
    public Seat mapRow(ResultSet rs, int rowNum) throws SQLException {
        Seat seat = new Seat();
        seat.setId(rs.getString("seat_id"));
        seat.setSeatNumber(rs.getInt("seat_number"));
        seat.setWaggon(rs.getString("waggon_id"));
        seat.setIsBought(rs.getString("is_bought").charAt(0));
        return seat;
    }
}
