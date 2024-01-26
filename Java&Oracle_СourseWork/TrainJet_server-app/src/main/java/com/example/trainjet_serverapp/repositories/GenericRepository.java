package com.example.trainjet_serverapp.repositories;

// create a generic repository
public interface GenericRepository<T> {
    T getById(String id);
    T create(T entity);
    T update(T entity);
    void delete(String id);

}
