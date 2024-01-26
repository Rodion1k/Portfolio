-- create index for trains_view

---user_orders_view
select SEAT_NUMBER,
       WAGGON_NAME,
       WAGGON_TYPE_NAME,
       TRAIN_NAME,
       TRAIN_TYPE,
       USER_NAME,
       IS_BOUGHT,
       PRICE,
       ORDER_ID,
       STATION_FROM,
       STATION_TO,
       TIME_FROM,
       TIME_TO,
       ROUTE_NAME,
       O.USER_PROFILE_ID as USER_PROFILE_ID
from USER_PROFILES
         JOIN ORDERS O on USER_PROFILES.USER_PROFILE_ID = O.USER_PROFILE_ID
         JOIN TICKETS_ORDERS T_O on O.ORDERS_ID = T_O.ORDER_ID
         JOIN TICKETS T on T.TICKET_ID = T_O.TICKET_ID
         JOIN SEATS S on S.SEAT_ID = T.SEAT_ID
         JOIN WAGGONS W on S.WAGON_ID = W.WAGGON_ID
         JOIN WAGGONS_TYPES W_T on W.WAGGON_TYPE_ID = W_T.TYPE_ID
         JOIN TRAINS on W.TRAIN_ID = TRAINS.TRAIN_ID
         JOIN TRAIN_TYPES on TRAINS.TRAIN_TYPE_ID = TRAIN_TYPES.TRAIN_TYPE_ID
         JOIN MOVEMENT_ROUTES_TRAINS MRT on TRAINS.TRAIN_ID = MRT.TRAIN_ID
         JOIN MOVEMENT_ROUTES MR on MRT.MOVEMENT_ROUTE_ID = MR.ROUTE_ID;

create index order_user_profile_id on ORDERS (USER_PROFILE_ID);
create index tickets_order_id on TICKETS_ORDERS (ORDER_ID);
create index teckets_orders_ticket_id on TICKETS_ORDERS (TICKET_ID);
create index tickets_seat_id on TICKETS (SEAT_ID);
create index seats_wagon_id on SEATS (WAGON_ID);
create index wagons_train_id on WAGGONS (TRAIN_ID);
create index wagons_type_id on WAGGONS (WAGGON_TYPE_ID);
create index trains_train_type_id on TRAINS (TRAIN_TYPE_ID);
create index movement_routes_trains_train_id on MOVEMENT_ROUTES_TRAINS (TRAIN_ID);
create index movement_routes_trains_route_id on MOVEMENT_ROUTES_TRAINS (MOVEMENT_ROUTE_ID);



create or replace procedure rebuildIndexProcedure
as
begin
    execute immediate 'alter index order_user_profile_id rebuild online';
    execute immediate 'alter index tickets_order_id rebuild online';
    execute immediate 'alter index teckets_orders_ticket_id rebuild online';
    execute immediate 'alter index tickets_seat_id rebuild online';
    execute immediate 'alter index seats_wagon_id rebuild online';
    execute immediate 'alter index wagons_train_id rebuild online';
    execute immediate 'alter index wagons_type_id rebuild online';
    execute immediate 'alter index trains_train_type_id rebuild online';
    execute immediate 'alter index movement_routes_trains_train_id rebuild online';
    execute immediate 'alter index movement_routes_trains_route_id rebuild online';
end;


begin
    dbms_scheduler.create_job(
            job_name => 'rebuildIndexJob',
            job_type => 'STORED_PROCEDURE',
            job_action => 'rebuildIndexProcedure',
            repeat_interval => 'FREQ=DAILY;INTERVAL=7',
            enabled => TRUE,
            comments => 'insert_into_statistics'
        );
end;



drop index order_user_profile_id ;
drop index tickets_order_id ;
drop index tickets_seat_id ;
drop index seats_wagon_id ;
drop index wagons_train_id ;
drop index wagons_type_id ;
drop index trains_train_type_id ;
drop index movement_routes_trains_train_id ;



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
order by POSITION_NUMBER;


create index user_id on  ORDERS(user_profile_id);
create index TRAINS_TRAIN_TYPE_ID on TRAINS(TRAIN_TYPE_ID);

select * from USER_INDEXES where TABLE_NAME = 'MOVEMENT_ROUTES_STATIONS' or TABLE_NAME = 'MOVEMENT_ROUTES_TRAINS' or TABLE_NAME = 'MOVEMENT_ROUTES' or TABLE_NAME = 'STATIONS' or TABLE_NAME = 'TRAINS' or TABLE_NAME = 'ORDERS' or TABLE_NAME = 'TICKETS_ORDERS' or TABLE_NAME = 'TICKETS' or TABLE_NAME = 'SEATS' or TABLE_NAME = 'WAGGONS' or TABLE_NAME = 'WAGGONS_TYPES' or TABLE_NAME = 'TRAIN_TYPES' or TABLE_NAME = 'USER_PROFILES';

 select*
            from USER_ORDERS_VIEW
            where IS_BOUGHT = '1'
              AND TIME_FROM between '1' and '15'
            order by TIME_FROM;

create index time_from on  ORDERS(time_from);
drop index time_from;
drop index user_id;

create index MOVEMENT_ROUTES_STATIONS_time_from on  MOVEMENT_ROUTES_STATIONS(POSITION_TIME);
drop index MOVEMENT_ROUTES_STATIONS_time_from ;

SELECT * FROM USER_ORDERS_VIEW WHERE TIME_FROM BETWEEN '1' AND '15'
                               AND IS_BOUGHT = '1' AND USER_PROFILE_ID = '1' AND ROUTE_NAME = '1'
                                   ORDER BY TIME_FROM;
