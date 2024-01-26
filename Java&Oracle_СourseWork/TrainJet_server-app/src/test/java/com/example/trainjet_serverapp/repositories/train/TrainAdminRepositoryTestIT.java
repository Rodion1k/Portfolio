package com.example.trainjet_serverapp.repositories.train;

import com.example.trainjet_serverapp.models.TrainType;
import com.example.trainjet_serverapp.request.models.TrainRequest;
import com.example.trainjet_serverapp.request.models.TrainTypeRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource("/application-test.properties")
public class TrainAdminRepositoryTestIT {

    @Autowired
    private TrainAdminRepository trainAdminRepository;

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addTrainTestWithCorrectTrainTypeShouldReturnTrue() throws Exception {
        TrainRequest trainRequest = new TrainRequest();
        trainRequest.setName("test");
        trainRequest.setTrainType("high-speed");
        String result = trainAdminRepository.addTrain(trainRequest).get();
        //assertEquals("1", result);
    }

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addTrainTypeTestWithCorrectTrainTypeShouldReturnTrue() throws Exception {
        TrainTypeRequest trainTypeRequest = new TrainTypeRequest();
        trainTypeRequest.setTrainType("high-speedss");
        trainTypeRequest.setPrice("100");
        Boolean result = trainAdminRepository.addTrainType(trainTypeRequest).get();
        assertTrue(result);
    }

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getTrainTypeTestWithCorrectTrainTypeShouldReturnTrainType() throws Exception {
        TrainType result = trainAdminRepository.getTrainTypeByName("high-speed").get();
        assertEquals("high-speed", result.getTrainType());
        assertEquals(100.0f, result.getPrice());
    }
    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getTrainTypeTestWithInCorrectTrainTypeShouldReturnNull() throws Exception {
        TrainType result = trainAdminRepository.getTrainTypeByName("high-speed56").get();
        assertNull(result);
    }
    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void deleteTrainTestWithInCorrectTrainTypeShouldReturnTrue() throws Exception {
        Boolean result = trainAdminRepository.deleteTrainByName("high-speed").join();
        assertTrue(result);
    }

}
