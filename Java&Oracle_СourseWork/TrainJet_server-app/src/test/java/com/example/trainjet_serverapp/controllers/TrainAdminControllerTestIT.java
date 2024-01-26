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
public class TrainAdminControllerTestIT {
    @Autowired
    private MockMvc mockMvc;

    // add before method and get access token from login

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addTrainTypeTestWithNotExistingTypeShouldReturnOK() throws Exception {
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/admin/train/addTrainType").content("{\"trainType\":\"high-speed22\",\"price\":\"100\"}").header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addTrainTypeTestWithExistingTypeShouldReturnBadRequest() throws Exception {
        ResponseEntity<?> result = (ResponseEntity<?>) this.mockMvc.perform(post("/admin/train/addTrainType").content("{\"trainType\":\"high-speed\",\"price\":\"100\"}").header("Content-Type", "application/json"))
                .andReturn().getAsyncResult();
        assertEquals(400, result.getStatusCodeValue());
    }
}
