package com.example.trainjet_serverapp.request.models;

public class RegisterRequest {
    private String login;
    private String password;
    private String name;
    private String surname;
    private String patronymic;
    private String email;
    private String passport;
    private String role;

    public void setLogin(String login) {
        this.login = login;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public String getEmail() {
        return email;
    }


    public String getPassport() {
        return passport;
    }

    public String getRole() {
        return role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public void setRole(String role) {
        this.role = role;
    }


}
