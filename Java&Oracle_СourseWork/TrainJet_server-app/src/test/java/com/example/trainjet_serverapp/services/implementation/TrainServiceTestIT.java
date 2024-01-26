package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.models.TrainType;
import com.example.trainjet_serverapp.request.models.TrainRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TrainServiceTestIT {
    @Autowired
    TrainService trainService;


//    @Test
//    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
//    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
//    public void addTrainAsyncTestWithExistingNameShouldReturnFalse() {
//        Boolean result = trainService.addTrainAsync(addTrainRequest).join();
//        assertFalse(result);
//    }

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getTrainTypeAsyncTestWithExistingNameShouldReturnTrainType() {
        TrainRequest trainRequest;
        trainRequest = new TrainRequest();
        trainRequest.setName("train1");
        trainRequest.setTrainType("high-speed");
        TrainType result = trainService.getTrainTypeAsync(trainRequest.getTrainType()).join();
        assertEquals(result.getTrainType(), trainRequest.getTrainType());
    }

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getTrainTypeAsyncTestWithNonExistingNameShouldReturnNull() {
        TrainRequest trainRequest;
        trainRequest = new TrainRequest();
        trainRequest.setName("train1");
        trainRequest.setTrainType("high-spee2d2");
        TrainType result = trainService.getTrainTypeAsync(trainRequest.getTrainType()).join();
        assertNull(result);
    }


}
