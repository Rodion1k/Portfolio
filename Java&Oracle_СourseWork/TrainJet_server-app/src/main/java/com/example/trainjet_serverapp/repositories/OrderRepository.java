package com.example.trainjet_serverapp.repositories;

import com.example.trainjet_serverapp.models.Seat;
import com.example.trainjet_serverapp.repositories.mapers.OnlyOrdersMapper;
import com.example.trainjet_serverapp.repositories.mapers.OrderResponseMapper;
import com.example.trainjet_serverapp.repositories.mapers.StatisticResponseMapper;
import com.example.trainjet_serverapp.request.models.OrderRequest;
import com.example.trainjet_serverapp.response.models.OnlyOrdersResponse;
import com.example.trainjet_serverapp.response.models.OrderResponse;
import com.example.trainjet_serverapp.response.models.StatisticResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Types;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Repository
public class OrderRepository {
    @Autowired
    @Qualifier("userJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Async
    public CompletableFuture<List<OrderResponse>> getUserCartOrders(String userId, Character status) {
        CompletableFuture<List<OrderResponse>> orders = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("ORDERS_PACKAGE_COMMON")
                    .withProcedureName("GET_USER_CART_ORDERS")
                    .declareParameters(
                            new SqlParameter("user_pr_id", Types.VARCHAR),
                            new SqlParameter("status", Types.CHAR),
                            new SqlOutParameter("u_orders_curs", Types.OTHER)
                    )
                    .returningResultSet("u_orders_curs", new OrderResponseMapper());
            Map<String, Object> result = jdbcCall.execute(userId, status);
            return (List<OrderResponse>) result.get("u_orders_curs");
        });
        return orders;
    }

    @Async
    public CompletableFuture<String> addOrder(String userId, OrderRequest order) {
        CompletableFuture<String> orderId = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("ORDERS_PACKAGE_COMMON")
                    .withProcedureName("ADD_ORDER")
                    .declareParameters(
                            new SqlParameter("user_pr_id", Types.VARCHAR),
                            new SqlParameter("order_price", Types.FLOAT),
                            new SqlParameter("st_from", Types.VARCHAR),
                            new SqlParameter("st_to", Types.VARCHAR),
                            new SqlParameter("t_from", Types.DATE),
                            new SqlParameter("t_to", Types.DATE),
                            new SqlOutParameter("order_pr_id", Types.VARCHAR)
                    );
            Map<String, Object> out = simpleJdbcCall.execute(userId, order.getPrice(),
                    order.getStationFrom(), order.getStationTo(), order.getDateFrom(),
                    order.getDateTo());
            return (String) out.get("order_pr_id");
        });

        return orderId;
    }

    @Async
    public CompletableFuture<Boolean> addSeatToOrder(String orderId, List<Seat> seats) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("TRAIN_JET_PDB_ADMIN")
                .withCatalogName("ORDERS_PACKAGE_COMMON")
                .withProcedureName("ADD_SEAT_TO_ORDER")
                .declareParameters(
                        new SqlParameter("p_order_id", Types.VARCHAR),
                        new SqlParameter("seat_pr_id", Types.VARCHAR)
                );
        for (Seat seat : seats) {
            simpleJdbcCall.execute(orderId, seat.getId());
        }
        return CompletableFuture.completedFuture(true);
    }

    @Async
    public CompletableFuture<Boolean> deleteOrder(String orderId) {
        CompletableFuture<Boolean> result = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("ORDERS_PACKAGE_COMMON")
                    .withProcedureName("DELETE_ORDER")
                    .declareParameters(
                            new SqlParameter("p_order_id", Types.VARCHAR)
                    );
            simpleJdbcCall.execute(orderId);
            return true;
        });
        return result;
    }

    @Async
    public CompletableFuture<Boolean> confirmOrder(String orderId) {
        CompletableFuture<Boolean> result = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("ORDERS_PACKAGE_COMMON")
                    .withProcedureName("CONFIRM_ORDER")
                    .declareParameters(
                            new SqlParameter("p_order_id", Types.VARCHAR)
                    );
            simpleJdbcCall.execute(orderId);
            return true;
        });
        return result;
    }
    @Async
    public CompletableFuture<List<OrderResponse>> getConfirmedOrders(Long dateFrom, Long dateTo) {
        Date dateFr = new Date(dateFrom);
        Date dateT = new Date(dateTo);
        CompletableFuture<List<OrderResponse>> orders = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("ORDERS_PACKAGE_COMMON")
                    .withProcedureName("GET_CONFIRMED_ORDERS")
                    .declareParameters(
                            new SqlParameter("t_from", Types.DATE),
                            new SqlParameter("t_to", Types.DATE),
                            new SqlOutParameter("u_orders_curs", Types.REF_CURSOR)
                    )
                    .returningResultSet("u_orders_curs", new OrderResponseMapper());
            Map<String, Object> result = jdbcCall.execute(dateFr, dateT);
            return (List<OrderResponse>) result.get("u_orders_curs");  // TODO implenet procedure on db
        });
        return orders;
    }

    @Async
    public CompletableFuture<List<StatisticResponse>> getStatistics(Long dateFrom, Long dateTo) {
        Date dateFr = new Date(dateFrom);
        Date dateT = new Date(dateTo);
        CompletableFuture<List<StatisticResponse>> statistics = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("PACKAGE_STATISTICS")
                    .withProcedureName("GET_STATISTICS")
                    .declareParameters(
                            new SqlParameter("p_date_from", Types.DATE),
                            new SqlParameter("p_date_to", Types.DATE),
                            new SqlOutParameter("p_count_cursor", Types.REF_CURSOR)
                    )
                    .returningResultSet("p_count_cursor", new StatisticResponseMapper());
            Map<String, Object> result = jdbcCall.execute(dateFr, dateT);
            return (List<StatisticResponse>) result.get("p_count_cursor");
        });
        return statistics;
    }

    @Async
    public CompletableFuture<List<OnlyOrdersResponse>> getAllOrders(Integer itemFrom, Integer itemTo) {
        CompletableFuture<List<OnlyOrdersResponse>> orders = CompletableFuture.supplyAsync(() -> {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("ORDERS_PACKAGE_COMMON")
                    .withProcedureName("GET_ALL_ORDERS")
                    .declareParameters(
                            new SqlParameter("item_from", Types.INTEGER),
                            new SqlParameter("item_to", Types.INTEGER),
                            new SqlOutParameter("p_orders_cursor", Types.REF_CURSOR)
                    )
                    .returningResultSet("p_orders_cursor", new OnlyOrdersMapper());
            Map<String, Object> result = jdbcCall.execute(itemFrom, itemTo);
            return (List<OnlyOrdersResponse>) result.get("p_orders_cursor");
        });
        return orders;
    }
}
