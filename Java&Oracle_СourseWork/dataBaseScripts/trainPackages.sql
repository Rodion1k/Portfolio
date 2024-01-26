---trains views ---

create or replace view TRAINS_VIEW
as
select TRAIN_ID, TRAIN_NAME, TT.TRAIN_TYPE
from TRAINS
         join TRAIN_TYPES TT on TT.TRAIN_TYPE_ID = TRAINS.TRAIN_TYPE_ID
with read only;

create or replace view TRAIN_INFO_VIEW
as
select TRAIN_TYPE,
       TRAIN_NAME,
       TRAIN_TYPE_COST,
       WAGGON_ID,
       WAGGON_NAME,
       WAGGON_TYPE_NAME,
       WAGGON_TYPE_SIZE,
       WAGGON_TYPE_COST,
       MOVEMENT_ROUTE_ID
from TRAINS
         join TRAIN_TYPES TT on TT.TRAIN_TYPE_ID = TRAINS.TRAIN_TYPE_ID
         join WAGGONS W on TRAINS.TRAIN_ID = W.TRAIN_ID
         join WAGGONS_TYPES on W.WAGGON_TYPE_ID = WAGGONS_TYPES.TYPE_ID
         join MOVEMENT_ROUTES_TRAINS MRT on TRAINS.TRAIN_ID = MRT.TRAIN_ID
with read only;


create or replace package train_package_admin
as
    procedure add_train(name in varchar2, tr_type in varchar2, id_out out varchar2);
    procedure get_train_by_name(tr_name in varchar2, train_curs out sys_refcursor);
    procedure get_train_type_by_name(name in varchar2, train_type_curs out sys_refcursor);
    procedure add_train_type(name in varchar2, price in number);
    procedure update_train_type_by_id(tr_id varchar2, name in varchar2, price in float);
    procedure delete_train_by_name(name varchar2);
    procedure delete_train_by_id(id varchar2);
end train_package_admin;



create or replace package body train_package_admin
as
    procedure add_train(name in varchar2, tr_type in varchar2, id_out out varchar2)
        is
        tr_type_id TRAIN_TYPES.TRAIN_TYPE_ID%type;
    begin
        select TRAIN_TYPE_ID into tr_type_id from TRAIN_TYPES where TRAIN_TYPE = tr_type;
        insert into TRAINS(TRAIN_NAME, TRAIN_TYPE_ID) values (name, tr_type_id) returning TRAIN_ID into id_out;
        PKG_MSGLOG.P_LOG_WRN('train_package_admin.add_train', 101, 'Train ' || name || ' added');
        commit;
    exception
        when no_data_found then
            PKG_MSGLOG.P_LOG_ERR('train_package_admin.add_train', EXCEPTIONS.ERR_NUM_DATA_NOT_FOUND,
                                 'Train type ' || tr_type || ' not found');
            error_handling.raise_data_not_found('Train type not found');
            commit;
        when EXCEPTIONS.EXC_ALREADY_EXISTS then
            PKG_MSGLOG.P_LOG_ERR('train_package_admin.add_train', EXCEPTIONS.ERR_NUM_ALREADY_EXISTS,
                                 'Train ' || name || ' already exists');
            error_handling.raise_data_not_found('Train already exists');
            commit;

    end;

    procedure delete_train_by_id(id varchar2)
    as
        t_id TRAINS.TRAIN_ID%type;
    begin
        -- check if train exists
        select TRAIN_ID into t_id from TRAINS where TRAIN_ID = id;
        delete from TRAINS where TRAIN_ID = id;
        commit;
    exception
        when no_data_found then
            error_handling.raise_id_not_found('Train not found');
    end;

    procedure get_train_by_name(tr_name in varchar2, train_curs out sys_refcursor)
        is
    begin
        open train_curs for
            select * from TRAINS where TRAIN_NAME = tr_name;
    end;

    procedure get_train_type_by_name(name in varchar2, train_type_curs out sys_refcursor)
    as
    begin
        open train_type_curs for
            select * from TRAIN_TYPES where TRAIN_TYPE = name;
    end;

    procedure add_train_type(name in varchar2, price in number)
    as
    begin
        insert into TRAIN_TYPES(TRAIN_TYPE, TRAIN_TYPE_COST) values (name, price);
        commit;
    exception
        when exceptions.EXC_ALREADY_EXISTS then
            PKG_MSGLOG.P_LOG_ERR('train_package_admin.add_train_type', EXCEPTIONS.ERR_NUM_ALREADY_EXISTS,
                                 'Train type ' || name || ' already exists');
            error_handling.RAISE_ALREADY_EXISTS('Train type already exists');
            commit;
    end;

    procedure delete_train_by_name(name varchar2)
    as
        t_name TRAINS.TRAIN_NAME%type;
    begin
        select TRAIN_NAME into t_name from TRAINS where TRAIN_NAME = name;
        delete from TRAINS where TRAIN_NAME = t_name;
        commit;
    exception
        when no_data_found then
            error_handling.raise_data_not_found('Train not found');
    end;

    procedure update_train_type_by_id(tr_id varchar2, name in varchar2, price in float)
    as
        t_id TRAIN_TYPES.TRAIN_TYPE_ID%type;
    begin
        select TRAIN_TYPE_ID into t_id from TRAIN_TYPES where TRAIN_TYPE_ID = tr_id;
        update TRAIN_TYPES set TRAIN_TYPE = name, TRAIN_TYPE_COST = price where TRAIN_TYPE_ID = tr_id;
        commit;
    exception
        when no_data_found then
            error_handling.raise_id_not_found('Train type not found');
    end;
end train_package_admin;

create or replace package train_package_common
as
    procedure get_train_types(item_from integer, item_to integer, train_type_curs out sys_refcursor);
    procedure get_trains(item_from integer, item_to integer, train_curs out sys_refcursor);
    procedure get_train_info(tr_name varchar2, r_id varchar2, train_info_curs out sys_refcursor);
end train_package_common;

create or replace package body train_package_common
as
    procedure get_train_info(tr_name varchar2, r_id varchar2, train_info_curs out sys_refcursor)
    as
    begin
        open train_info_curs
            for select *
                from TRAIN_INFO_VIEW
                where TRAIN_NAME = tr_name
                  and MOVEMENT_ROUTE_ID = r_id;
    end;
    procedure
        get_train_types(item_from integer, item_to integer, train_type_curs out sys_refcursor) as
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
        open train_type_curs for
            select *
            from (select TRAIN_TYPES.*, ROWNUM rn from TRAIN_TYPES)
            where rn between it_from and it_to;
    end;

    procedure
        get_trains(item_from integer, item_to integer, train_curs out sys_refcursor) as
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
        open train_curs for
            select *
            from (select TRAINS_VIEW.*, ROWNUM rn from TRAINS_VIEW)
            where rn between it_from and it_to;
    end;
end train_package_common;



select *
from (select TRAINS_VIEW.*, ROWNUM rn from TRAINS_VIEW)
where rn between 1 and general_package.max_int;


