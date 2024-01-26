package com.example.trainjet_serverapp.repositories.mapers;

import com.example.trainjet_serverapp.models.User;
import com.example.trainjet_serverapp.models.UserLogin;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class UserLoginMapper implements RowMapper<UserLogin> {

    @Override
    public UserLogin mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        UserLogin userLogin = new UserLogin();
        userLogin.setId(resultSet.getString("user_id"));
        userLogin.setLogin(resultSet.getString("user_login"));
        userLogin.setPassword(resultSet.getString("user_password"));
        userLogin.setRole(resultSet.getString("user_role"));
        return userLogin;
    }
}
