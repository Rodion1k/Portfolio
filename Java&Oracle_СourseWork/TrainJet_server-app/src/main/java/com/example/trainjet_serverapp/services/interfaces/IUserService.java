package com.example.trainjet_serverapp.services.interfaces;

import com.example.trainjet_serverapp.request.models.AuthenticateRequest;
import com.example.trainjet_serverapp.models.User;
import com.example.trainjet_serverapp.request.models.RegisterRequest;
import com.example.trainjet_serverapp.security.PersonDetails;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IUserService {
    List<User> getAllUsers();

    User getUserById(String id);

    CompletableFuture<Boolean> registerAsync(RegisterRequest user);

    User updateUser(User user);

    boolean deleteUser(String id);

    CompletableFuture<PersonDetails> authenticateAsync(AuthenticateRequest model);
}
