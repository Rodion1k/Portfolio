-- waggon views ------

create or replace view WAGGONS_VIEW
as
select WAGGON_ID, WAGGON_NAME, WT.WAGGON_TYPE_NAME
from WAGGONS
         join WAGGONS_TYPES WT on WT.TYPE_ID = WAGGONS.WAGGON_TYPE_ID
with read only;

select *
from WAGGONS_VIEW;



create or replace package waggon_package_admin
as
    procedure get_waggon_type_by_name(name in varchar2, waggon_type_curs out sys_refcursor);
    procedure add_waggon_type(name in varchar2, price in number, wag_size in number);
    procedure add_waggon(name in number, wag_type in varchar2, tr_id in varchar2);
end waggon_package_admin;

create or replace package body waggon_package_admin
as
    procedure get_waggon_type_by_name(name in varchar2, waggon_type_curs out sys_refcursor)
    as
    begin
        open waggon_type_curs for
            select * from WAGGONS_TYPES where WAGGON_TYPE_NAME = name;
    end;

    procedure add_waggon_type(name in varchar2, price in number, wag_size in number)
    as
    begin
        if price < 0 then
            ERROR_HANDLING.RAISE_INVALID_INPUT('price must be positive');
        end if;
        if wag_size < 0 then
            ERROR_HANDLING.RAISE_INVALID_INPUT('waggon size must be positive');
        end if;
        insert into WAGGONS_TYPES(WAGGON_TYPE_NAME, WAGGON_TYPE_COST, WAGGON_TYPE_SIZE)
        values (name, price, wag_size);
        PKG_MSGLOG.P_LOG_WRN('waggon_package_admin.add_waggon_type', 101, 'Waggon type added');
        commit;
    exception
        when exceptions.exc_already_exists then
            PKG_MSGLOG.P_LOG_ERR('waggon_package_admin.add_waggon_type', exceptions.ERR_NUM_ALREADY_EXISTS,
                                 'waggon type already exists');
            commit;
            ERROR_HANDLING.RAISE_ALREADY_EXISTS('waggon type with name ' || name || ' already exists');
    end;

    procedure add_waggon(name in number, wag_type in varchar2, tr_id in varchar2)
    as
        wag_type_id WAGGONS_TYPES.TYPE_ID%type;
        wag_size    WAGGONS_TYPES.WAGGON_TYPE_SIZE%type;
        st_id       SEATS.SEAT_ID%TYPE;
    begin
        select TYPE_ID, WAGGON_TYPE_SIZE
        into wag_type_id, wag_size
        from WAGGONS_TYPES
        where WAGGON_TYPE_NAME = wag_type;
        insert into WAGGONS(WAGGON_NAME, WAGGON_TYPE_ID, TRAIN_ID) values (name, wag_type_id, tr_id);
        select WAGGON_ID into wag_type_id from WAGGONS where WAGGON_NAME = name and TRAIN_ID = tr_id;
        -- insert into seats seats from 1 to wag_size
        for i in 1..wag_size
            loop
                insert into SEATS(WAGON_ID, SEAT_NUMBER) values (wag_type_id, i);
                select SEAT_ID into st_id from SEATS where WAGON_ID = wag_type_id and SEAT_NUMBER = i;
                insert into TICKETS(SEAT_ID) VALUES (st_id);
            end loop;
        PKG_MSGLOG.P_LOG_WRN('waggon_package_admin.add_waggon', 101, 'Waggon added');
        commit;
    exception
        when no_data_found then
            PKG_MSGLOG.P_LOG_ERR('waggon_package_admin.add_waggon', sqlcode,
                                 'waggon type not found');
            commit;
            ERROR_HANDLING.RAISE_DATA_NOT_FOUND('waggon type with name ' || wag_type || ' not found');
    end;

end waggon_package_admin;

delete
from SEATS
where SEAT_NUMBER = 61;

select *
from TICKETS
         join SEATS S on S.SEAT_ID = TICKETS.SEAT_ID
         join WAGGONS W on W.WAGGON_ID = S.WAGON_ID
         join TRAINS T on T.TRAIN_ID = W.TRAIN_ID
         join MOVEMENT_ROUTES_TRAINS MRT on MRT.TRAIN_ID = T.TRAIN_ID
         join MOVEMENT_ROUTES MR on MR.ROUTE_ID = MRT.MOVEMENT_ROUTE_ID;

create or replace package wagon_package_common
as
    procedure get_wagon_types(item_from integer, item_to integer, wagon_type_curs out sys_refcursor);
    procedure get_wagons(item_from integer, item_to integer, wagon_curs out sys_refcursor);

end wagon_package_common;

create or replace package body wagon_package_common
as
    procedure get_wagon_types(item_from integer, item_to integer, wagon_type_curs out sys_refcursor)
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
        open wagon_type_curs for
            select *
            from (select WAGGONS_TYPES.*, ROWNUM rn from WAGGONS_TYPES)
            where rn between it_from and it_to;
    end;

    procedure get_wagons(item_from integer, item_to integer, wagon_curs out sys_refcursor)
    as
    begin
        open wagon_curs for
            select *
            from (select WAGGONS_VIEW.*, ROWNUM rn from WAGGONS_VIEW)
            where rn between item_from and item_to; --TODO by id
    end;
end wagon_package_common;



