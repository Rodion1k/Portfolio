package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.security.IPersonDetails;
import com.example.trainjet_serverapp.security.PersonDetails;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class JwtTokenServiceImplementationTest {

    @Autowired
    private JwtTokenServiceImplementation jwtTokenService;

    @Test
    void generateTokenResultShouldNotBeNull() {
        IPersonDetails user = new PersonDetails("admin", "admin", "admin","admin");
        String token = jwtTokenService.generateToken(user);
        assertNotNull(token);
    }

    @Test
    void validateTokenShouldReturnTrue() {
        IPersonDetails user = new PersonDetails("admin", "admin", "admin","admin");
        String token = jwtTokenService.generateToken(user);
        assertTrue(jwtTokenService.validateToken(token));
    }
    @Test
    void validateTokenShouldReturnFalse() {
        IPersonDetails user = new PersonDetails("admin", "admin", "admin","admin");
        String token = jwtTokenService.generateToken(user);
        assertFalse(jwtTokenService.validateToken(token+"1"));
    }

    @Test
    void parseTokenWithValidUserShouldReturnTrue() {
        IPersonDetails user = new PersonDetails("admin", "admin", "admin","admin");
        String token = jwtTokenService.generateToken(user);
        boolean result = assertEqualsPersonDetails(user, jwtTokenService.parseToken(token));
        assertTrue(result);
    }

    private boolean assertEqualsPersonDetails(IPersonDetails personDetails, IPersonDetails personDetails1) {
        return personDetails.getUsername().equals(personDetails1.getUsername()) &&
                personDetails.getPassword().equals(personDetails1.getPassword()) &&
                personDetails.getId().equals(personDetails1.getId());
    }

    @Test
    void parseTokenWithBadUserShouldReturnFalse() {
        IPersonDetails user = new PersonDetails("admin", "admin", "admin","admin");
        String token = jwtTokenService.generateToken(user);
        user = new PersonDetails("admin1", "admin1", "admin1","admin");
        boolean result = assertEqualsPersonDetails(user, jwtTokenService.parseToken(token));
        assertFalse(result);
    }
}