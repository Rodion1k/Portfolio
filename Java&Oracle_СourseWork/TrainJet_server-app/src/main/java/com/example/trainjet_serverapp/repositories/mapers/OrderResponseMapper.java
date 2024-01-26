package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.response.models.OrderResponse;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class OrderResponseMapper implements RowMapper<OrderResponse> {

    @Override
    public OrderResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setSeatNumber(rs.getInt("seat_number"));
        orderResponse.setWaggonName(rs.getString("waggon_name"));
        orderResponse.setWaggonType(rs.getString("waggon_type_name"));
        orderResponse.setTrainName(rs.getString("train_name"));
        orderResponse.setTrainType(rs.getString("train_type"));
        orderResponse.setUserName(rs.getString("user_name"));
        orderResponse.setPrice(rs.getString("price"));
        orderResponse.setOrderId(rs.getString("order_id"));
        orderResponse.setUserId(rs.getString("user_profile_id"));
        orderResponse.setRouteName(rs.getString("route_name"));
        orderResponse.setStatus(rs.getString("is_bought").charAt(0));
        orderResponse.setStationFrom(rs.getString("station_from"));
        orderResponse.setStationTo(rs.getString("station_to"));
        orderResponse.setDateFrom(rs.getDate("time_from"));
        orderResponse.setDateTo(rs.getDate("time_to"));
        return orderResponse;
    }
}
