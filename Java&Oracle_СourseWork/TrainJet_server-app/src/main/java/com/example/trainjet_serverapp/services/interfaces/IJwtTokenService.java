package com.example.trainjet_serverapp.services.interfaces;

import com.example.trainjet_serverapp.security.IPersonDetails;
import org.springframework.security.core.userdetails.UserDetails;

public interface IJwtTokenService {
    String generateToken(IPersonDetails user);
    UserDetails parseToken(String token);
}
