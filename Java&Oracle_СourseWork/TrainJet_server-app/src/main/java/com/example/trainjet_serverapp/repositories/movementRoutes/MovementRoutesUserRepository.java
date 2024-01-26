package com.example.trainjet_serverapp.repositories.movementRoutes;

import com.example.trainjet_serverapp.models.MovementRouteRow;
import com.example.trainjet_serverapp.models.Station;
import com.example.trainjet_serverapp.models.TrainFlight;
import com.example.trainjet_serverapp.repositories.mapers.FlightMapper;
import com.example.trainjet_serverapp.repositories.mapers.MovementRouteMapper;
import com.example.trainjet_serverapp.repositories.mapers.StationMapper;
import com.example.trainjet_serverapp.request.models.MovementRouteRequest;
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

import java.sql.Types;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Repository
public class MovementRoutesUserRepository {
    @Autowired
    @Qualifier("userJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Async
    public CompletableFuture<List<Station>> getStations(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<Station>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("STATIONS_PACKAGE_COMMON")
                    .withProcedureName("GET_STATIONS")
                    .declareParameters(
                            new SqlOutParameter("stations_curs", Types.REF_CURSOR),
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER)
                    )
                    .returningResultSet("stations_curs", new StationMapper());
            Map<String, Object> out = simpleJdbcCall.execute(itemFrom, itemTo);
            return (List<Station>) out.get("stations_curs");
        });
        return queryResult;
    }

    @Async
    public CompletableFuture<List<MovementRouteRow>> getRoutes(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<MovementRouteRow>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_COMMON")
                    .withProcedureName("GET_MOVEMENT_ROUTES")
                    .declareParameters(
                            new SqlOutParameter("routes_cursor", Types.REF_CURSOR),
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER)
                    )
                    .returningResultSet("routes_cursor", new MovementRouteMapper());
            Map<String, Object> out = simpleJdbcCall.execute(itemFrom, itemTo);
            return (List<MovementRouteRow>) out.get("routes_cursor");
        });
        return queryResult;
    }

    @Async
    public CompletableFuture<List<TrainFlight>> getFlights(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<TrainFlight>> queryResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_COMMON")
                    .withProcedureName("GET_ALL_FLIGHTS")
                    .declareParameters(
                            new SqlOutParameter("flights_cursor", Types.REF_CURSOR),
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER)
                    )
                    .returningResultSet("flights_cursor", new FlightMapper());
            Map<String, Object> out = simpleJdbcCall.execute(itemFrom, itemTo);
            return (List<TrainFlight>) out.get("flights_cursor");
        });
        return queryResult;
    }
}
