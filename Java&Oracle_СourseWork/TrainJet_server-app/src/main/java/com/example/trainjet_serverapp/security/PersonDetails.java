package com.example.trainjet_serverapp.security;

import com.example.trainjet_serverapp.models.UserLogin;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class PersonDetails implements IPersonDetails {

    private final UserLogin userLogin;

    public PersonDetails(String id, String login, String password, String role) {
        this.userLogin = new UserLogin(id, login, password, role);
    }

    public PersonDetails(UserLogin userLogin) {
        this.userLogin = userLogin;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(userLogin.getRole()));
    }

    @Override
    public String getId() {
        return userLogin.getId();
    }

    @Override
    public String getRole() {
        return userLogin.getRole();
    }


    @Override
    public String getPassword() {
        return userLogin.getPassword();
    }

    @Override
    public String getUsername() {
        return userLogin.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
