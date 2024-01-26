package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.response.models.OrderResponse;
import com.example.trainjet_serverapp.response.models.StatisticResponse;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StatisticResponseMapper implements RowMapper<StatisticResponse> {
    @Override
    public StatisticResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
        StatisticResponse statisticResponse = new StatisticResponse();
        statisticResponse.setDate(rs.getDate("date_from"));
        statisticResponse.setCount(rs.getInt("count"));
        return statisticResponse;
    }
}
