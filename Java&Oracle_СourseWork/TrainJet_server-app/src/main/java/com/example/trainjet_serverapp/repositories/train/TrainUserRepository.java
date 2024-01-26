package com.example.trainjet_serverapp.repositories.train;

import com.example.trainjet_serverapp.models.Seat;
import com.example.trainjet_serverapp.models.Train;
import com.example.trainjet_serverapp.models.TrainType;
import com.example.trainjet_serverapp.models.WaggonType;
import com.example.trainjet_serverapp.repositories.mapers.*;
import com.example.trainjet_serverapp.response.models.TrainInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.Types;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Repository
public class TrainUserRepository {
    @Autowired
    @Qualifier("userJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Async
    public CompletableFuture<List<TrainType>> getTrainTypes(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<TrainType>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("TRAIN_PACKAGE_COMMON")
                    .withProcedureName("GET_TRAIN_TYPES")
                    .declareParameters(
                            new SqlOutParameter("train_type_curs", Types.REF_CURSOR),
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER)
                    )
                    .returningResultSet("train_type_curs", new TrainTypeMapper());
            Map<String, Object> out = simpleJdbcCall.execute(itemFrom, itemTo);
            return (List<TrainType>) out.get("train_type_curs");
        });
        return queryResult;
    }

    @Async
    public CompletableFuture<List<Train>> getTrains(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<Train>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("TRAIN_PACKAGE_COMMON")
                    .withProcedureName("GET_TRAINS")
                    .declareParameters(
                            new SqlOutParameter("train_curs", Types.REF_CURSOR),
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER)
                    )
                    .returningResultSet("train_curs", new TrainMapper());
            Map<String, Object> out = simpleJdbcCall.execute(itemFrom, itemTo);
            return (List<Train>) out.get("train_curs");
        });
        return queryResult;
    }

    @Async
    public CompletableFuture<List<WaggonType>> getWaggonTypes(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<WaggonType>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("WAGON_PACKAGE_COMMON")
                    .withProcedureName("GET_WAGON_TYPES")
                    .declareParameters(
                            new SqlOutParameter("wagon_type_curs", Types.REF_CURSOR),
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER)
                    )
                    .returningResultSet("wagon_type_curs", new WaggonTypeMapper());
            Map<String, Object> out = simpleJdbcCall.execute(itemFrom, itemTo);
            return (List<WaggonType>) out.get("wagon_type_curs");
        });
        return queryResult;

    }

    @Async
    public CompletableFuture<List<Seat>> getSeats(String waggonId, String routeId, String trainName) {
        CompletableFuture<List<Seat>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("SEAT_PACKAGE_COMMON")
                    .withProcedureName("GET_SEATS_BY_WAGGON_ID")
                    .declareParameters(
                            new SqlParameter("wag_id", Types.VARCHAR),
                            new SqlParameter("r_id", Types.VARCHAR),
                            new SqlParameter("tr_name", Types.VARCHAR),
                            new SqlOutParameter("seat_curs", Types.REF_CURSOR)
                    )
                    .returningResultSet("seat_curs", new SeatMapper());
            Map<String, Object> out = simpleJdbcCall.execute(waggonId, routeId, trainName);
            return (List<Seat>) out.get("seat_curs");
        });
        return queryResult;
    }

    @Async
    public CompletableFuture<List<TrainInfo>> getTrainInfo(String trainName, String routeId) {
        CompletableFuture<List<TrainInfo>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("TRAIN_PACKAGE_COMMON")
                    .withProcedureName("GET_TRAIN_INFO")
                    .declareParameters(
                            new SqlOutParameter("train_info_curs", Types.REF_CURSOR),
                            new SqlParameter("tr_name", Types.VARCHAR),
                            new SqlParameter("r_id", Types.VARCHAR)
                    )
                    .returningResultSet("train_info_curs", new TrainInfoMapper());
            Map<String, Object> out = simpleJdbcCall.execute(trainName, routeId);
            return (List<TrainInfo>) out.get("train_info_curs");
        });
        return queryResult;
    }
}
