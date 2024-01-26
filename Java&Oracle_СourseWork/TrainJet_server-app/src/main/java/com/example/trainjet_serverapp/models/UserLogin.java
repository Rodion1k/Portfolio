package com.example.trainjet_serverapp.models;

public class UserLogin {
    private String id;
    private String login;
    private String password;

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    private String role;

    public UserLogin() {
    }

    public UserLogin(String id, String login, String password, String role) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.role = role;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }
}
