package com.example.trainjet_serverapp.services.interfaces;

import com.example.trainjet_serverapp.models.TrainType;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IGenericModelService {
    CompletableFuture<Integer> getSize(String tableName);
}
