package com.example.trainjet_serverapp.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.sql.Types;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Repository
public class GenericModelRepository {
    @Autowired
    @Qualifier("userJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Async
    public CompletableFuture<Integer> getSize(String tableName) {
        CompletableFuture<Integer> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("GENERAL_PACKAGE")
                    .withProcedureName("GET_SIZE")
                    .declareParameters(
                            new SqlParameter("p_table", Types.VARCHAR),
                            new SqlOutParameter("p_size", Types.INTEGER)
                    );
            Map<String, Object> out = simpleJdbcCall.execute(tableName);
            return (Integer) out.get("p_size");
        });
        return queryResult;
    }

}
