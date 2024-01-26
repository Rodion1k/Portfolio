package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.request.models.AuthenticateRequest;
import com.example.trainjet_serverapp.models.User;
import com.example.trainjet_serverapp.models.UserLogin;
import com.example.trainjet_serverapp.repositories.UserRepository;
import com.example.trainjet_serverapp.request.models.RegisterRequest;
import com.example.trainjet_serverapp.security.PersonDetails;
import com.example.trainjet_serverapp.services.interfaces.IUserService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Override
    public User getUserById(String id) {
        return userRepository.getUserById(id);
    }

    @Override
    public CompletableFuture<Boolean> registerAsync(RegisterRequest user) {

        CompletableFuture<UserLogin> result = userRepository.getUserByLogin(user.getLogin());
        try {
            if (result.get() != null) {
                return CompletableFuture.completedFuture(false);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        CompletableFuture<Boolean> addUserLoginResult = userRepository.addUser(user);
        try {
            Boolean res = addUserLoginResult.get();
            return CompletableFuture.completedFuture(res);
        } catch (InterruptedException | ExecutionException e) {
            return CompletableFuture.completedFuture(false);
        }
    }


    @Override
    public User updateUser(User user) {
        return userRepository.updateUser(user);
    }

    @Override
    public boolean deleteUser(String id) {
        return userRepository.deleteUser(id);
    }

    @Override
    @Async
    public CompletableFuture<PersonDetails> authenticateAsync(AuthenticateRequest model) {
        CompletableFuture<UserLogin> result = userRepository.getUserByLogin(model.getLogin());
        UserLogin userLogin = null;
        try {
            userLogin = result.get();
            if (userLogin != null) {
                if (passwordEncoder.matches(model.getPassword(), userLogin.getPassword())) {
                    return CompletableFuture.completedFuture(new PersonDetails(userLogin));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CompletableFuture.completedFuture(null);
    }
}