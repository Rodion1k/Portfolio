package com.example.trainjet_serverapp.repositories.train;

import com.example.trainjet_serverapp.models.Train;
import com.example.trainjet_serverapp.models.TrainType;
import com.example.trainjet_serverapp.repositories.train.TrainUserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource("/application-test.properties")
public class TrainUserRepositoryTestIT {
    @Autowired
    private TrainUserRepository trainUserRepository;

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getAllTrainsTestShouldReturnThreeTrains() throws Exception {
        List<Train> trains = this.trainUserRepository.getTrains(1,3).join();
        assertEquals(3, trains.size());
    }

    @Test
    @Sql(value = {"/train.sql.scripts/add-train-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/train.sql.scripts/add-train-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getAllTrainTypesTestShouldReturnThreeTrainTypes() throws Exception {
        List<TrainType> trains = this.trainUserRepository.getTrainTypes(2,3).join();
        assertEquals(3, trains.size());
    }

}
