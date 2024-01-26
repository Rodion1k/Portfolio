package com.example.trainjet_serverapp.services.implementation;

import com.example.trainjet_serverapp.repositories.GenericModelRepository;
import com.example.trainjet_serverapp.services.interfaces.IGenericModelService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class GenericModelService implements IGenericModelService {
    private final GenericModelRepository genericModelRepository;

    public GenericModelService(GenericModelRepository genericModelRepository) {
        this.genericModelRepository = genericModelRepository;
    }

    @Override
    @Async
    public CompletableFuture<Integer> getSize(String tableName) {
        return CompletableFuture.completedFuture(genericModelRepository.getSize(tableName).join());
    }
}
