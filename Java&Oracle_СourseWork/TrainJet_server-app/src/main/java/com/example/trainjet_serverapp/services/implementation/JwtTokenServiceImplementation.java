package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.security.IPersonDetails;
import com.example.trainjet_serverapp.security.PersonDetails;
import com.example.trainjet_serverapp.services.interfaces.IJwtTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtTokenServiceImplementation implements IJwtTokenService {
    private final Key secret = MacProvider.generateKey(SignatureAlgorithm.HS512);
    private final byte[] secretBytes = secret.getEncoded();
    private final String base64SecretBytes = Base64.getEncoder().encodeToString(secretBytes);

    @Override//TODO Async
    public String generateToken(IPersonDetails user) {
        Date expirationDate = Date.from(LocalDateTime.now().plusMinutes(50).atZone(java.time.ZoneId.systemDefault()).toInstant());
        String id = UUID.randomUUID().toString().replace("-", "");
        return Jwts.builder()
                .setSubject(id)
                .claim("id", user.getId())
                .claim("sub", user.getUsername())
                .claim("pas", user.getPassword())
                .claim("role", user.getRole())
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, base64SecretBytes)
                .compact();
    }

    // create and implement validate token method

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(base64SecretBytes)
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // send error message to client
            return false;
        }
    }


    @Override
    public IPersonDetails parseToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(base64SecretBytes)
                .parseClaimsJws(token)
                .getBody();
        String id = claims.get("id", String.class);
        String login = claims.get("sub", String.class);
        String password = claims.get("pas", String.class);
        String role = claims.get("role", String.class);
        return new PersonDetails(id, login, password, role);
    }
}

