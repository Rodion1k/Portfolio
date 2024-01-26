package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.WaggonType;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class WaggonTypeMapper implements RowMapper<WaggonType> {


    @Override
    public WaggonType mapRow(ResultSet rs, int rowNum) throws SQLException {
        WaggonType waggonType = new WaggonType();
        waggonType.setId(rs.getString("type_id"));
        waggonType.setName(rs.getString("waggon_type_name"));
        waggonType.setSize(rs.getInt("waggon_type_size"));
        waggonType.setPrice(rs.getFloat("waggon_type_cost"));
        return waggonType;
    }
}
