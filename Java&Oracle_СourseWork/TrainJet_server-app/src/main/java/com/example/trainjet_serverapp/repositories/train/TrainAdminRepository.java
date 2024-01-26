package com.example.trainjet_serverapp.repositories.train;

import com.example.trainjet_serverapp.models.Train;
import com.example.trainjet_serverapp.models.TrainType;
import com.example.trainjet_serverapp.models.Waggon;
import com.example.trainjet_serverapp.models.WaggonType;
import com.example.trainjet_serverapp.repositories.mapers.TrainMapper;
import com.example.trainjet_serverapp.repositories.mapers.TrainModelMapper;
import com.example.trainjet_serverapp.repositories.mapers.TrainTypeMapper;
import com.example.trainjet_serverapp.repositories.mapers.WaggonTypeMapper;
import com.example.trainjet_serverapp.request.models.TrainRequest;
import com.example.trainjet_serverapp.request.models.TrainTypeRequest;
import com.example.trainjet_serverapp.request.models.WaggonRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Repository
public class TrainAdminRepository {

    @Autowired
    @Qualifier("adminJdbcTemplate")
    private JdbcTemplate jdbcTemplate;


    @Async
    public CompletableFuture<String> addTrain(TrainRequest train) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("TRAIN_PACKAGE_ADMIN")
                .withProcedureName("ADD_TRAIN")
                .declareParameters(
                        new SqlParameter("name", Types.VARCHAR),
                        new SqlParameter("tr_type", Types.VARCHAR),
                        new SqlOutParameter("id_out", Types.VARCHAR)
                );
        SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                "name", train.getName(),
                "tr_type", train.getTrainType()
        ));
        Map<String, Object> out = simpleJdbcCall.execute(in);
        String id = (String) out.get("id_out");
        return CompletableFuture.completedFuture(id);
    }

    @Async
    public CompletableFuture<Boolean> addTrainType(TrainTypeRequest trainType) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("TRAIN_PACKAGE_ADMIN")
                .withProcedureName("ADD_TRAIN_TYPE")
                .declareParameters(
                        new SqlParameter("name", Types.VARCHAR),
                        new SqlParameter("price", Types.FLOAT)
                );
        SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                "name", trainType.getTrainType(),
                "price", trainType.getPrice()
        ));
        simpleJdbcCall.execute(in);
        return CompletableFuture.completedFuture(true);
    }

    @Async
    public CompletableFuture<Boolean> addWaggon(Waggon waggon, String trainId) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("WAGGON_PACKAGE_ADMIN")
                .withProcedureName("ADD_WAGGON")
                .declareParameters(
                        new SqlParameter("name", Types.INTEGER),
                        new SqlParameter("wag_type", Types.VARCHAR),
                        new SqlParameter("tr_id", Types.VARCHAR)
                );
        SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                "name", waggon.getWaggonNumber(),
                "wag_type", waggon.getWaggonType(),
                "tr_id", trainId
        ));
        simpleJdbcCall.execute(in);
        return CompletableFuture.completedFuture(true);
    }

    @Async
    public CompletableFuture<Train> getTrainByName(String name) {
        CompletableFuture<List<Train>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("TRAIN_PACKAGE_ADMIN")
                    .withProcedureName("GET_TRAIN_BY_NAME")
                    .declareParameters(
                            new SqlParameter("tr_name", Types.VARCHAR),
                            new SqlOutParameter("train_curs", Types.REF_CURSOR, new TrainMapper())
                    )
                    .returningResultSet("train_curs", new TrainModelMapper());
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "tr_name", name
            ));
            Map<String, Object> out = simpleJdbcCall.execute(in);
            return (List<Train>) out.get("train_curs");
        });
        List<Train> trains = queryResult.join();
        Train train = null;
        if (trains.size() > 0) {
            train = trains.get(0);
        }
        return CompletableFuture.completedFuture(train);
    }

    @Async

    public CompletableFuture<TrainType> getTrainTypeByName(String name) {
        CompletableFuture<List<TrainType>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("TRAIN_PACKAGE_ADMIN")
                    .withProcedureName("GET_TRAIN_TYPE_BY_NAME")
                    .declareParameters(
                            new SqlParameter("train_type", Types.VARCHAR),
                            new SqlOutParameter("train_type_curs", Types.REF_CURSOR)
                    )
                    .returningResultSet("train_type_curs", new TrainTypeMapper());
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "name", name
            ));
            Map<String, Object> out = simpleJdbcCall.execute(in);
            return (List<TrainType>) out.get("train_type_curs");
        });
        List<TrainType> trainTypes = queryResult.join();
        TrainType trainType = null;
        if (trainTypes.size() > 0) {
            trainType = trainTypes.get(0);
        }
        return CompletableFuture.completedFuture(trainType);
    }

    @Async

    public CompletableFuture<Boolean> deleteTrainByName(String name) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("TRAIN_PACKAGE_ADMIN")
                .withProcedureName("DELETE_TRAIN_BY_NAME")
                .declareParameters(
                        new SqlParameter("name", Types.VARCHAR)
                );
        SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                "name", name
        ));
        simpleJdbcCall.execute(in);
        return CompletableFuture.completedFuture(true);
    }

    @Async

    public CompletableFuture<Boolean> updateTrainTypeById(TrainType trainType) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("TRAIN_PACKAGE_ADMIN")
                .withProcedureName("UPDATE_TRAIN_TYPE_BY_ID")
                .declareParameters(
                        new SqlParameter("tr_id", Types.VARCHAR),
                        new SqlParameter("name", Types.VARCHAR),
                        new SqlParameter("price", Types.FLOAT)
                );
        SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                "tr_id", trainType.getId(),
                "name", trainType.getTrainType(),
                "price", trainType.getPrice()
        ));
        simpleJdbcCall.execute(in);
        return CompletableFuture.completedFuture(true);
    }

    @Async
    public CompletableFuture<Boolean> addWaggonType(WaggonRequest waggonType) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("WAGGON_PACKAGE_ADMIN")
                .withProcedureName("ADD_WAGGON_TYPE")
                .declareParameters(
                        new SqlParameter("name", Types.VARCHAR),
                        new SqlParameter("price", Types.FLOAT),
                        new SqlParameter("wag_size", Types.INTEGER)
                );
        SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                "name", waggonType.getName(),
                "price", waggonType.getPrice(),
                "wag_size", waggonType.getSize()
        ));
        try {
            simpleJdbcCall.execute(in);
        } catch (Exception e) {
            return CompletableFuture.completedFuture(false);
        }
        return CompletableFuture.completedFuture(true);
    }

    @Async
    public CompletableFuture<WaggonType> getWaggonTypeByName(String name) {
        CompletableFuture<List<WaggonType>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("WAGGON_PACKAGE_ADMIN")
                    .withProcedureName("GET_WAGGON_TYPE_BY_NAME")
                    .declareParameters(
                            new SqlParameter("name", Types.VARCHAR),
                            new SqlOutParameter("waggon_type_curs", Types.REF_CURSOR)
                    )
                    .returningResultSet("waggon_type_curs", new WaggonTypeMapper());
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "name", name
            ));
            Map<String, Object> out = simpleJdbcCall.execute(in);
            return (List<WaggonType>) out.get("waggon_type_curs");
        });
        List<WaggonType> waggonTypes = queryResult.join();
        WaggonType waggonType = null;
        if (waggonTypes.size() > 0) {
            waggonType = waggonTypes.get(0);
        }
        return CompletableFuture.completedFuture(waggonType);
    }

    @Async
    public CompletableFuture<Boolean> deleteTrain(String id) {
        CompletableFuture<Boolean> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("TRAIN_PACKAGE_ADMIN")
                    .withProcedureName("DELETE_TRAIN_BY_ID")
                    .declareParameters(
                            new SqlParameter("id", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "id", id
            ));
            simpleJdbcCall.execute(in);
            return true;
        });
        return queryResult;
    }


}
