package com.example.trainjet_serverapp.controllers;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/application-test.properties")
public class AuthControllerTestIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void loginTestWithCorrectLoginShouldReturnOK() throws Exception {
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/api/auth/login").content("{\"login\":\"admin\",\"password\":\"admin\"}").header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void loginTestWithIncorrectLoginShouldReturnBadRequest() throws Exception {
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/api/auth/login").content("{\"login\":\"admfin\",\"password\":\"admin\"}").header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(400, result.getStatusCodeValue());
    }

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void loginTestWithIncorrectPasswordShouldReturnBadRequest() throws Exception {
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/api/auth/login").content("{\"login\":\"admin\",\"password\":\"admi2n\"}").header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(400, result.getStatusCodeValue());
    }

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addUserTestWithCorrectDataShouldReturnOK() throws Exception {
        String user =
                "{\"login\":\"admin2\",\"password\":\"admin1\",\"name\":\"admin\",\"surname\":\"admin\"," +
                        "\"patronymic\":\"admin\",\"email\":\"adm@mail.ru\"," +
                        "\"role\":\"admin\",\"passport\":\"1234567890\"}";
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/api/auth/register").content(user).header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addUserTestWithIncorrectDataShouldReturnBadRequest() throws Exception {
        String user =
                "{\"login\":\"admin\",\"password\":\"admin1\",\"name\":\"admin\",\"surname\":\"admin\"," +
                        "\"patronymic\":\"admin\",\"email\":\"adm@mail.ru\"," +
                       "\"role\":\"admin\",\"passport\":\"1234567890\"}";
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/api/auth/register").content(user).header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(400, result.getStatusCodeValue());
    }


}
