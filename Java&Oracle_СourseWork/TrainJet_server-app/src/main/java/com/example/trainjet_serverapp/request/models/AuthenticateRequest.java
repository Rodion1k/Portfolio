package com.example.trainjet_serverapp.request.models;

public class AuthenticateRequest {
    private String login;
    private String password;
    public void setLogin(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }
}
