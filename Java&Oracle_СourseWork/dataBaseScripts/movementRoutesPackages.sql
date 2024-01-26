--- movement_routes_views----

create or replace view MOVEMENT_ROUTE_VIEW
as
select ROUTE_ID,
       ROUTE_NAME,
       STATION_NAME,
       POSITION_NUMBER,
       POSITION_TIME
from movement_routes
         join MOVEMENT_ROUTES_STATIONS MRS
              on MOVEMENT_ROUTES.ROUTE_ID = MRS.MOVEMENT_ROUTE_ID
         join stations on stations.station_id = MRS.station_id
order by ROUTE_ID, POSITION_NUMBER
with read only;

create or replace view FLIGHTS_VIEW
as
select TRAIN_NAME,
       ROUTE_ID,
       ROUTE_NAME,
       STATION_NAME,
       POSITION_NUMBER,
       POSITION_TIME
from movement_routes
         join MOVEMENT_ROUTES_STATIONS MRS
              on MOVEMENT_ROUTES.ROUTE_ID = MRS.MOVEMENT_ROUTE_ID
         join stations on stations.station_id = MRS.station_id
         join MOVEMENT_ROUTES_TRAINS M on MOVEMENT_ROUTES.ROUTE_ID = M.MOVEMENT_ROUTE_ID
         join TRAINS T on M.TRAIN_ID = T.TRAIN_ID
order by POSITION_NUMBER
with read only;

select *
from FLIGHTS_VIEW;

create or replace package movement_route_package_admin
as
    procedure add_movement_route(r_name in varchar2, p_route_id out varchar2);
    procedure add_station_to_route(p_route_id in varchar2, st_id in varchar2, pos_number in number,
                                   pos_time in date);
    procedure add_train_to_route(p_route_id in varchar2, tr_id in varchar2);
    procedure delete_station_from_route(p_route_id in varchar2, st_name in varchar2);
    procedure update_date_of_station(st_name in varchar2, pos_time in date);
    procedure delete_flight(p_route_id in varchar2);
    procedure delete_train_from_route(p_route_id in varchar2, tr_name in varchar2);
end movement_route_package_admin;



create or replace package body movement_route_package_admin
as
    procedure add_movement_route(r_name in varchar2, p_route_id out varchar2)
    as
    begin
        --check if route name is unique
        insert into movement_routes(ROUTE_NAME) values (r_name);
        commit;
        select route_id into p_route_id from movement_routes where route_name = r_name;
    exception
        when EXCEPTIONS.EXC_ALREADY_EXISTS
            then ERROR_HANDLING.RAISE_ALREADY_EXISTS('Route with this name already exists');
            PKG_MSGLOG.P_LOG_ERR('movement_route_package_admin.add_movement_route', EXCEPTIONS.ERR_NUM_ALREADY_EXISTS,
                                 'Route with this name already exists');
            commit;
    end;
    procedure add_station_to_route(p_route_id in varchar2, st_id in varchar2, pos_number in number,
                                   pos_time in date)
    as
    begin
        insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
        values (p_route_id, st_id, pos_number, pos_time);
        commit;
    end;
    procedure add_train_to_route(p_route_id in varchar2, tr_id in varchar2)
    as
        t_count number;
    begin
        select count(*)
        into t_count
        from movement_routes_trains
        where movement_route_id = p_route_id
          and train_id = tr_id;
        if t_count = 0 then
            insert into movement_routes_trains(movement_route_id, train_id) values (p_route_id, tr_id);
            commit;
        else
            ERROR_HANDLING.RAISE_ALREADY_EXISTS('Train already exists in this route');
            PKG_MSGLOG.P_LOG_ERR('movement_route_package_admin.add_train_to_route', EXCEPTIONS.ERR_NUM_ALREADY_EXISTS,
                                 'Train already exists in this route');
            commit;
        end if;
    end;
    procedure delete_station_from_route(p_route_id in varchar2, st_name in varchar2)
    as
        cursor c1 is-- TODO тригер на обновление orders
            select *
            from movement_routes_stations
            where movement_route_id = p_route_id
            order by position_number;
        P_count number := 1;
        st_id   STATIONS.STATION_ID%type;
    begin
        select station_id into st_id from stations where station_name = st_name;
        delete from movement_routes_stations where movement_route_id = p_route_id and station_id = st_id;
        for i in c1
            loop
                dbms_output.put_line(i.position_number);
                update movement_routes_stations
                set position_number = P_count
                where station_id = i.station_id;
                P_count := P_count + 1;
            end loop;
        commit;
    exception
        when others
            then
                ERROR_HANDLING.RAISE_ERROR(-30000, 'Error while deleting station from route');
                PKG_MSGLOG.P_LOG_ERR('movement_route_package_admin.delete_station_from_route', sqlcode,
                                     'Error while deleting station from route');
                commit;
    end;
    procedure update_date_of_station(st_name in varchar2, pos_time in date)
    as
        st_id STATIONS.STATION_ID%type;
    begin
        select station_id into st_id from stations where station_name = st_name;
        update movement_routes_stations
        set position_time = pos_time
        where station_id = st_id;
        commit;
    exception
        when others
            then
                ERROR_HANDLING.RAISE_ERROR(-30000, 'Error while updating date of station');
                PKG_MSGLOG.P_LOG_ERR('movement_route_package_admin.update_date_of_station', sqlcode,
                                     'Error while updating date of station');
                commit;
    end;
    procedure delete_flight(p_route_id in varchar2)
    as
    begin
        delete from movement_routes where route_id = p_route_id;
        commit;
    end;
    procedure delete_train_from_route(p_route_id in varchar2, tr_name in varchar2)
    as
        tr_id TRAINS.TRAIN_ID%type;
    begin
        select train_id into tr_id from trains where train_name = tr_name;
        delete from movement_routes_trains where movement_route_id = p_route_id and train_id = tr_id;
        commit;
    exception
        when others then
            ERROR_HANDLING.RAISE_ERROR(-30000, 'Error while deleting train from route');
            PKG_MSGLOG.P_LOG_ERR('movement_route_package_admin.delete_train_from_route', sqlcode,
                                 'Error while deleting train from route');
            commit;
    end;
end movement_route_package_admin;



create or replace package movement_route_package_common
as
    procedure get_movement_routes(item_from integer, item_to integer, routes_cursor out sys_refcursor);
    procedure get_train_flights(tr_id in varchar2, flights_cursor out sys_refcursor);
    procedure get_all_flights(item_from integer, item_to integer, flights_cursor out sys_refcursor);
end movement_route_package_common;

create or replace package body movement_route_package_common
as
    --general_package
    procedure get_movement_routes(item_from integer, item_to integer, routes_cursor out sys_refcursor)
    as
        it_from integer;
        it_to   integer;
    begin
        if item_from = 0 then
            it_from := 1;
        else
            it_from := item_from;
        end if;
        if item_to = 0 then
            it_to := general_package.max_int;
        else
            it_to := item_to;
        end if;
        open routes_cursor for
            select *
            from (select MOVEMENT_ROUTE_VIEW.*, ROWNUM rn from MOVEMENT_ROUTE_VIEW)
            where rn between it_from and it_to;
    end;
    procedure get_train_flights(tr_id in varchar2, flights_cursor out sys_refcursor)
    as
    begin
        open flights_cursor for select ROUTE_ID,
                                       ROUTE_NAME,
                                       STATION_NAME,
                                       POSITION_NUMBER,
                                       POSITION_TIME
                                from movement_routes
                                         join MOVEMENT_ROUTES_STATIONS MRS
                                              on MOVEMENT_ROUTES.ROUTE_ID = MRS.MOVEMENT_ROUTE_ID
                                         join stations on stations.station_id = MRS.station_id
                                         join movement_routes_trains MRT
                                              on MRT.MOVEMENT_ROUTE_ID = MRS.MOVEMENT_ROUTE_ID
                                where tr_id = MRT.train_id;
    end;
    procedure get_all_flights(item_from integer, item_to integer, flights_cursor out sys_refcursor)
    as
        it_from integer;
        it_to   integer;
    begin
        if item_from = 0 then
            it_from := 1;
        else
            it_from := item_from;
        end if;
        if item_to = 0 then
            it_to := general_package.max_int;
        else
            it_to := item_to;
        end if;
        open flights_cursor for
            select *
            from (select FLIGHTS_VIEW.*, ROWNUM rn from FLIGHTS_VIEW)
            where rn between it_from and it_to;
    end;
end movement_route_package_common;




