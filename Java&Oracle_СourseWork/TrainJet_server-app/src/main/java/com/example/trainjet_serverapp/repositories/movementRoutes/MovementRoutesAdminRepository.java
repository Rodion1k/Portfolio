package com.example.trainjet_serverapp.repositories.movementRoutes;

import com.example.trainjet_serverapp.request.models.FlightRequest;
import com.example.trainjet_serverapp.request.models.MovementRouteRequest;
import com.example.trainjet_serverapp.request.models.StationRoute;
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

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;


@Repository
public class MovementRoutesAdminRepository {

    @Autowired
    @Qualifier("adminJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Async
    public CompletableFuture<Boolean> addStation(String stationName) {
        CompletableFuture<Boolean> addStationResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("STATIONS_PACKAGE_ADMIN")
                    .withProcedureName("ADD_STATION")
                    .declareParameters(
                            new SqlParameter("s_name", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "s_name", stationName
            ));
            try {
                simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return false;
            }
            return true;
        });
        return addStationResult;
    }

    @Async
    public CompletableFuture<Boolean> deleteStationById(String stationId) {
        CompletableFuture<Boolean> deleteStationResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTES_PACKAGE_ADMIN")
                    .withProcedureName("DELETE_STATION_BY_ID")
                    .declareParameters(
                            new SqlParameter("id", Types.INTEGER)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "id", stationId
            ));
            simpleJdbcCall.execute(in);
            return true;
        });
        return deleteStationResult;
    }

    @Async
    public CompletableFuture<Boolean> addMovementRoute(MovementRouteRequest route) {
        CompletableFuture<String> addMovementRouteResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("ADD_MOVEMENT_ROUTE")
                    .declareParameters(
                            new SqlParameter("r_name", Types.VARCHAR),
                            new SqlOutParameter("p_route_id", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValue("r_name", route.getName());
            Map<String, Object> out = new HashMap<>();
            try {
                out = simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return "";
            }
            return (String) out.get("p_route_id");
        });
        CompletableFuture<Boolean> addStationsRouteResult = addMovementRouteResult.thenApplyAsync(routeId -> {
            if (routeId.equals("")) {
                return false;
            }
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("ADD_STATION_TO_ROUTE")
                    .declareParameters(
                            new SqlParameter("p_route_id", Types.VARCHAR),
                            new SqlParameter("st_id", Types.VARCHAR),
                            new SqlParameter("pos_number", Types.INTEGER),
                            new SqlParameter("pos_time", Types.DATE)
                    );
            for (StationRoute stationRoute : route.getStationRoutes()) {
                SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                        "p_route_id", routeId,
                        "st_id", stationRoute.getStationId(),
                        "pos_number", stationRoute.getPositionNumber(),
                        "pos_time", stationRoute.getPositionTime()
                ));
                simpleJdbcCall.execute(in);
            }
            return true;
        });

        return addStationsRouteResult;
    }

    @Async
    public CompletableFuture<Boolean> createFlight(FlightRequest flightRequest) {
        CompletableFuture<Boolean> createFlightResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("ADD_TRAIN_TO_ROUTE")
                    .declareParameters(
                            new SqlParameter("p_route_id", Types.VARCHAR),
                            new SqlParameter("tr_id", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "p_route_id", flightRequest.getRouteId(),
                    "tr_id", flightRequest.getTrainId()
            ));
            try {
                simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return false;
            }
            return true;
        });
        return createFlightResult;
    }

    @Async
    public CompletableFuture<Boolean> deleteFlight(String routeId) {
        CompletableFuture<Boolean> deleteFlightResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("DELETE_FLIGHT")
                    .declareParameters(
                            new SqlParameter("p_route_id", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "p_route_id", routeId
            ));
            try {
                simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return false;
            }
            return true;
        });
        return deleteFlightResult;
    }

    @Async
    public CompletableFuture<Boolean> deleteStationFromRoute(String routeId, String stationName) {
        CompletableFuture<Boolean> deleteStationFromRouteResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("DELETE_STATION_FROM_ROUTE")
                    .declareParameters(
                            new SqlParameter("p_route_id", Types.VARCHAR),
                            new SqlParameter("st_name", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "p_route_id", routeId,
                    "st_name", stationName
            ));
            try {
                simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return false;
            }
            return true;
        });
        return deleteStationFromRouteResult;
    }

    @Async
    public CompletableFuture<Boolean> deleteTrainFromRoute(String routeId, String trainName) {
        CompletableFuture<Boolean> deleteTrainFromRouteResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("DELETE_TRAIN_FROM_ROUTE")
                    .declareParameters(
                            new SqlParameter("p_route_id", Types.VARCHAR),
                            new SqlParameter("tr_name", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "p_route_id", routeId,
                    "tr_name", trainName
            ));
            try {
                simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return false;
            }
            return true;
        });
        return deleteTrainFromRouteResult;
    }

    @Async
    public CompletableFuture<Boolean> updateTime(Long newTime, String stationName) {
        Date newDate = new Date(newTime);
        CompletableFuture<Boolean> updateTimeResult = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("MOVEMENT_ROUTE_PACKAGE_ADMIN")
                    .withProcedureName("UPDATE_DATE_OF_STATION")
                    .declareParameters(
                            new SqlParameter("st_name", Types.VARCHAR),
                            new SqlParameter("pos_time", Types.DATE)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "st_name", stationName,
                    "pos_time", newDate
            ));
            try {
                simpleJdbcCall.execute(in);
            } catch (Exception e) {
                return false;
            }
            return true;
        });
        return updateTimeResult;
    }
}
