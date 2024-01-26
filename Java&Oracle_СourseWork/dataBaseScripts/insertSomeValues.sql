insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', 'F1484994A04B4A91A51F612BE7A26259', 1,
        to_date('13.11.2022 14:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', '2BB0D85A2B264CA0A45CC736B611D5D2', 2,
        to_date('13.11.2022 15:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', '14D7A9C06C834F2F82F900CFB1BEE5AA', 3,
        to_date('13.11.2022 16:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', '918C79251ECB497BB619649C20094CE5', 4,
        to_date('13.11.2022 17:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', 'CE3FA956947A42378396337660FDF057', 5,
        to_date('13.11.2022 18:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', 'FE38DF52F6F9457DB44CBC90A115CB4C', 7,
        to_date('13.11.2022 19:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', '6ABCB6BA9AA6499FB99694005387F459', 8,
        to_date('13.11.2022 20:00:00', 'dd.mm.yyyy hh24:mi:ss'));
insert into movement_routes_stations(MOVEMENT_ROUTE_ID, station_id, position_number, position_time)
values ('3558C3549CDC4A2FB159B606427DAE1C', '5D061158D53B4E73BCBE16D8E1C003F8', 9,
        to_date('13.11.2022 21:00:00', 'dd.mm.yyyy hh24:mi:ss'));

insert into movement_routes_trains(movement_route_id, train_id)
values ('3558C3549CDC4A2FB159B606427DAE1C', '141E5E0ECF7E4A0E92AA3B40BB9A3730');

select COUNT(*) from TICKETS;

declare
    v_price        ORDERS.PRICE%type:=10;
    v_station_from ORDERS.STATION_FROM%type;
    v_station_to   ORDERS.STATION_TO%type;
    v_time_from    ORDERS.TIME_FROM%type;
    v_time_to      ORDERS.TIME_TO%type;
begin
    for i in 1..100000
        loop
            generate_random_station(v_station_from);
            generate_random_station(v_station_to);
            generate_random_time(v_time_from);
            generate_random_time(v_time_to);
            insert into orders (user_profile_id, price, station_from, station_to, time_from, time_to)
            VALUES ('24E7CCC640104EF7B0C13B89C5D23F82', v_price, v_station_from, v_station_to, v_time_from, v_time_to);
        end loop;
    exception when others then
        DBMS_OUTPUT.PUT_LINE(v_price);
end;

select COUNT(*) from orders where PRICE=10;

create or replace procedure generate_random_price(p_price out ORDERS.PRICE%type)
    is
begin
    p_price := round(dbms_random.value(10, 100), 0);
end;

declare
    random_price ORDERS.PRICE%type;
begin
    generate_random_price(random_price);
    dbms_output.put_line(random_price);
end;

create or replace procedure generate_random_station(p_station out ORDERS.STATION_FROM%type)
    is
begin
    select STATION_NAME
    into p_station
    from stations
    where STATION_ID = (select STATION_ID
                        from stations
                        order by dbms_random.value fetch first 1 row only);
end;

declare
    random_station ORDERS.STATION_FROM%type;
begin
    generate_random_station(random_station);
    dbms_output.put_line(random_station);
end;

create or replace procedure generate_random_time(p_time out ORDERS.TIME_FROM%type)
    is
begin
    select POSITION_TIME
    into p_time
    from movement_routes_stations
    where MOVEMENT_ROUTE_ID = (select MOVEMENT_ROUTE_ID
                               from movement_routes_stations
                               order by dbms_random.value fetch first 1 row only) fetch first 1 row only;
end;

declare
    random_time ORDERS.TIME_FROM%type;
begin
    generate_random_time(random_time);
    dbms_output.put_line(random_time);
end;



declare

    begin

end;