package com.example.trainjet_serverapp.controllers;

import com.example.trainjet_serverapp.request.models.AuthenticateRequest;
import com.example.trainjet_serverapp.request.models.RegisterRequest;
import com.example.trainjet_serverapp.response.models.BadRequestMessage;
import com.example.trainjet_serverapp.response.models.LoginResponse;
import com.example.trainjet_serverapp.response.models.SuccessResponse;
import com.example.trainjet_serverapp.security.IPersonDetails;
import com.example.trainjet_serverapp.security.PersonDetails;
import com.example.trainjet_serverapp.services.MailSender;
import com.example.trainjet_serverapp.services.implementation.JwtTokenServiceImplementation;
import com.example.trainjet_serverapp.services.implementation.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenServiceImplementation jwtTokenService;
    private final MailSender mailSender;

    public AuthController(UserService userService, JwtTokenServiceImplementation jwtTokenService, MailSender mailSender) {
        this.userService = userService;
        this.jwtTokenService = jwtTokenService;
        this.mailSender = mailSender;
    }


    @PostMapping("/login")
    @Async
    public CompletableFuture<ResponseEntity<?>> login(@RequestBody AuthenticateRequest model) {
        CompletableFuture<PersonDetails> result = userService.authenticateAsync(model);
        try {
            PersonDetails personDetails = result.get();
            if (personDetails != null) {
                String token = jwtTokenService.generateToken(personDetails);
                LoginResponse loginResponse = new LoginResponse(token, personDetails.getRole(), personDetails.getId());
                return CompletableFuture.completedFuture(ResponseEntity.ok(loginResponse));
            } else {
                return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("Invalid login or password")));
            }
        } catch (Exception e) {
            return CompletableFuture.completedFuture(ResponseEntity.internalServerError().body(e.getMessage()));
        }
    }

    @PostMapping("/register")
    @Async
    public CompletableFuture<ResponseEntity<?>> register(@RequestBody RegisterRequest model) {
        CompletableFuture<Boolean> result = userService.registerAsync(model);
        try {
            Boolean res = result.get();
            if (res) {
                mailSender.send("rodion_vaisera@mail.ru", "Registration", "You have successfully registered");
                return CompletableFuture.completedFuture(ResponseEntity.ok(new SuccessResponse("User registered successfully")));
            } else {
                return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(new BadRequestMessage("User already exist")));
            }
        } catch (Exception e) {
            return CompletableFuture.completedFuture(ResponseEntity.internalServerError().body(e.getMessage()));
        }
    }

    @PostMapping("/isUserLoggedIn")
    @Async
    public CompletableFuture<ResponseEntity<?>> isUserLoggedIn(@RequestHeader("Authorization") String token) {
        try {
            String parsedToken = getTokenFromRequest(token);//check for null
            IPersonDetails personDetails = jwtTokenService.parseToken(parsedToken);
            if (personDetails != null) {
                LoginResponse loginResponse = new LoginResponse(parsedToken, personDetails.getRole(), personDetails.getId());
                return CompletableFuture.completedFuture(ResponseEntity.ok(loginResponse));
            }
        } catch (Exception e) {
            return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new BadRequestMessage("User is not logged in")));
        }
        return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new BadRequestMessage("User is not logged in")));
    }

    private String getTokenFromRequest(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }
}
