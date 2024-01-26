package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.response.models.OnlyOrdersResponse;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class OnlyOrdersMapper implements RowMapper<OnlyOrdersResponse> {
    @Override
    public OnlyOrdersResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
        OnlyOrdersResponse onlyOrdersResponse = new OnlyOrdersResponse();
        onlyOrdersResponse.setId(rs.getString("orders_id"));
        onlyOrdersResponse.setUserId(rs.getString("user_profile_id"));
        onlyOrdersResponse.setPrice(rs.getString("price"));
        onlyOrdersResponse.setStationFrom(rs.getString("station_from"));
        onlyOrdersResponse.setStationTo(rs.getString("station_to"));
        onlyOrdersResponse.setDateFrom(rs.getDate("time_from"));
        onlyOrdersResponse.setDateTo(rs.getDate("time_to"));
        return onlyOrdersResponse;
    }
}
