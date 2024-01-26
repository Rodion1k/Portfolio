create or replace package stations_package_admin
as
    procedure add_station(s_name in varchar2);
    --procedure delete_station_by_name(s_name in varchar2);
end stations_package_admin;

create or replace package body stations_package_admin
as
    procedure add_station(s_name in varchar2)
    as
    begin
        insert into STATIONS(STATION_NAME) values (s_name);
        commit;
    exception
        when exceptions.exc_already_exists then
            error_handling.RAISE_ALREADY_EXISTS('station ' || s_name || ' already exists');
    end;

end stations_package_admin;

begin
    stations_package_admin.add_station('Бобруйск');

end ;


create or replace package stations_package_common
as
    procedure get_stations(item_from integer, item_to integer, stations_curs out sys_refcursor);
end stations_package_common;

create or replace package body stations_package_common
as
    procedure get_stations(item_from integer, item_to integer, stations_curs out sys_refcursor)
    as
        it_from integer;
        it_to   integer;
    begin
        if (item_from < 0 or item_to < 0 or item_from > item_to) then
            error_handling.RAISE_INVALID_INPUT('item_from and item_to wrong');
        end if;
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
        open stations_curs for
            select *
            from (select STATIONS.*, ROWNUM rn from STATIONS)
            where rn between it_from and it_to;
    exception
        when others then
            pkg_msglog.P_LOG_Err('stations_package_common.get_stations()', sqlcode, sqlerrm, 'get_stations');
            error_handling.RAISE_ERROR(sqlcode, sqlerrm);
    end;
end stations_package_common;



