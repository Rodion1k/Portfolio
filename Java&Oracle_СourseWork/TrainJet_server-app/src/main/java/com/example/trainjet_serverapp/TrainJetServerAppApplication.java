package com.example.trainjet_serverapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync(proxyTargetClass = true)
public class TrainJetServerAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainJetServerAppApplication.class, args);
    }


}
