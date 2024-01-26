package com.example.trainjet_serverapp.models;

import com.example.trainjet_serverapp.request.models.RegisterRequest;

public class User {
    private UserLogin userLogin;
    private UserProfile userProfile;

    public UserLogin getUserLogin() {
        return userLogin;
    }


    public void setUserLogin(UserLogin userLogin) {
        this.userLogin = userLogin;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }
}
