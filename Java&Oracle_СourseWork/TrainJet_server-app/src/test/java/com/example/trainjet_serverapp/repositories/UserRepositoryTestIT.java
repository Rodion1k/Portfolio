package com.example.trainjet_serverapp.repositories;

import com.example.trainjet_serverapp.models.UserLogin;
import com.example.trainjet_serverapp.request.models.RegisterRequest;
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
public class UserRepositoryTestIT {


    @Autowired
    private UserRepository userRepository;

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getUserByLoginTestWithCorrectLoginShouldReturnOK() throws Exception {
        UserLogin resultUserLogin = userRepository.getUserByLogin("admin").get();
        assertEquals("admin", resultUserLogin.getLogin());
    }

    @Test
    @Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void getUserByLoginTestWithInCorrectLoginShouldReturnNull() throws Exception {
        UserLogin resultUserLogin = userRepository.getUserByLogin("admin2f").get();
        assertNull(resultUserLogin);
    }

    @Test
    //@Sql(value = {"/user.sql.scripts/add-user_login-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = {"/user.sql.scripts/add-user_login-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    public void addUserTestWithCorrectLoginShouldReturnTrue() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setLogin("admin2");
        registerRequest.setPassword("admin2");
        registerRequest.setEmail("fsdf");
        registerRequest.setName("fsdf");
        registerRequest.setSurname("fsdf");
        registerRequest.setPatronymic("fsdf");
        registerRequest.setRole("fsdf");
        registerRequest.setPassport("fsdf");
        Boolean result = userRepository.addUser(registerRequest).get();
        assertTrue(result);
        UserLogin resultUserLogin = userRepository.getUserByLogin("admin2").get();
        assertEquals("admin2", resultUserLogin.getLogin());
    }





}
