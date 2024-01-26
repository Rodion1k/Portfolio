package com.example.trainjet_serverapp.repositories;

import com.example.trainjet_serverapp.models.User;
import com.example.trainjet_serverapp.models.UserLogin;
import com.example.trainjet_serverapp.repositories.mapers.UserLoginMapper;
import com.example.trainjet_serverapp.request.models.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
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
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Repository
public class UserRepository {

    private List<User> users;
    @Autowired
    @Qualifier("adminJdbcTemplate")

    private  JdbcTemplate jdbcTemplate;

    public List<User> getAllUsers() {
        return users;
    }

    public User getUserById(String id) {
        return users.stream().filter(user -> user.getUserLogin().getId().equals(id)).findFirst().orElse(null);
    }

    @Async
    public CompletableFuture<Boolean> addUser(RegisterRequest user) {
        CompletableFuture<Boolean> addUserLoginResult = CompletableFuture.supplyAsync(() ->
        {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("USER_PACKAGE_ADMIN")
                    .withProcedureName("ADD_USER_LOGIN")
                    .declareParameters(
                            new SqlParameter("login", Types.VARCHAR),
                            new SqlParameter("password", Types.VARCHAR),
                            new SqlParameter("role",Types.VARCHAR),
                            new SqlOutParameter("id_out", Types.VARCHAR)
                    );
            SqlParameterSource in = new MapSqlParameterSource().addValues(Map.of(
                    "login", user.getLogin(),
                    "password", user.getPassword(),
                    "role",user.getRole()
            ));
            Map<String, Object> out = simpleJdbcCall.execute(in);
            String id = (String) out.get("id_out");
            if (id == null) {
                return false;
            }
            simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("USER_PACKAGE_ADMIN")
                    .withProcedureName("ADD_USER_PROFILE");
            in = new MapSqlParameterSource().addValues(Map.of(
                    "id", id,
                    "name", user.getName(),
                    "surname", user.getSurname(),
                    "patronymic", user.getPatronymic(),
                    "email", user.getEmail(),
                    "passport", user.getPassport()
            ));
            simpleJdbcCall.execute(in);//TODO проверить на что-то
            return true;
        });
        try {
            boolean result = addUserLoginResult.get();
            return CompletableFuture.completedFuture(result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return CompletableFuture.completedFuture(false);
        }
    }

    @Async
    public CompletableFuture<UserLogin> getUserByLogin(String login) {
        // async query to db using jdbc template
        CompletableFuture<List<UserLogin>> queryResult = CompletableFuture.supplyAsync(() ->
        {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withSchemaName("TRAIN_JET_PDB_ADMIN")
                    .withCatalogName("USER_PACKAGE_ADMIN")
                    .withProcedureName("GET_USER_LOGIN_BY_LOGIN")
                    .declareParameters(
                            new SqlParameter("login", Types.VARCHAR),
                            new SqlOutParameter("u_logins_curs", Types.REF_CURSOR)
                    )
                    .returningResultSet("u_logins_curs", new UserLoginMapper());

            SqlParameterSource in = new MapSqlParameterSource().addValue("login", login);
            Map<String, Object> out = simpleJdbcCall.execute(in);
            List<UserLogin> userLogins = (List<UserLogin>) out.get("u_logins_curs");
            return userLogins;
        });
        List<UserLogin> userLogins = null;
        try {
            userLogins = queryResult.get();//TODO переделать на join
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        UserLogin userLogin = null;
        if (userLogins != null && userLogins.size() != 0) userLogin = userLogins.get(0);
        return CompletableFuture.completedFuture(userLogin);
    }

    public User updateUser(User user) {


//        User oldUser = getUserById(user.getUserLogin().getId());
//        oldUser.setFirstName(user.getFirstName());
//        oldUser.setLastName(user.getLastName());
//        oldUser.setMiddleName(user.getMiddleName());
//        oldUser.setBirthDate(user.getBirthDate());
//        oldUser.setGender(user.getGender());
//        oldUser.setPhoneNumber(user.getPhoneNumber());
//        oldUser.setAddress(user.getAddress());
//        oldUser.setPassport(user.getPassport());
//        oldUser.setRole(user.getRole());
        return user;
    }

    public boolean deleteUser(String id) {
        User user = getUserById(id);
        if (user != null) {
            users.remove(user);
            return true;
        }
        return false;
    }
}
