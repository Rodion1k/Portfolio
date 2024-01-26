package com.example.trainjet_serverapp.security;

import org.springframework.security.core.userdetails.UserDetails;

public interface IPersonDetails extends UserDetails {
    String getId();
    String getRole();
}
