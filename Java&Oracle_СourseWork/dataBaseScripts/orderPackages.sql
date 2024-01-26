create or replace view USER_ORDERS_VIEW
as
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
         JOIN MOVEMENT_ROUTES MR on MRT.MOVEMENT_ROUTE_ID = MR.ROUTE_ID
;

update USER_ORDERS_VIEW
set IS_BOUGHT = '0'
where IS_BOUGHT = '2'
  and ORDER_ID = 'EFD29EA2608C01A0E053020013AC20C3';
select *
from SEATS
where IS_BOUGHT = '2';
update SEATS
set IS_BOUGHT = '0'
where IS_BOUGHT = '2';
select *
from USER_ORDERS_VIEW
where ORDER_ID = 'EFD29EA2608C01A0E053020013AC20C3';
drop view USER_ORDERS_VIEW;

delete
from TICKETS_ORDERS;
delete
from ORDERS;
delete
from TICKETS;
delete
from SEATS;
delete
from WAGGONS;
delete
from WAGGONS_TYPES;
delete
from MOVEMENT_ROUTES_TRAINS;
delete
from TRAINS;
delete
from TRAIN_TYPES;
delete
from MOVEMENT_ROUTES_STATIONS;
delete
from MOVEMENT_ROUTES;
delete
from STATIONS;



create or replace package orders_package_common
as
    procedure add_order(user_pr_id in varchar2, order_price in float, st_from in varchar2,
                        st_to in varchar2, t_from in date, t_to in date, order_pr_id out varchar2);
    procedure add_seat_to_order(p_order_id in varchar2, seat_pr_id in varchar2);
    procedure get_user_cart_orders(user_pr_id in varchar2, status in char, u_orders_curs out sys_refcursor);
    procedure get_confirmed_orders(t_from date, t_to date, u_orders_curs out sys_refcursor);
    procedure delete_order(p_order_id in varchar2);
    procedure confirm_order(p_order_id in varchar2);
    procedure get_all_orders(item_from integer, item_to integer, p_orders_cursor out sys_refcursor);
end orders_package_common;
--     delete from TICKETS;
--      delete from TICKETS_ORDERS;
--      delete from orders;


create or replace package body orders_package_common
as
    procedure get_all_orders(item_from integer, item_to integer, p_orders_cursor out sys_refcursor)
    as
    begin
        open p_orders_cursor for
            select *
            from (select ORDERS.*, rownum rn from ORDERS)
            where rn between item_from and item_to;
    end;
    procedure add_order(user_pr_id in varchar2, order_price in float, st_from in varchar2,
                        st_to in varchar2, t_from in date, t_to in date, order_pr_id out varchar2)
    as
        id_order_out ORDERS.ORDERS_ID%type;
    begin
        insert into ORDERS(USER_PROFILE_ID, PRICE, STATION_FROM, STATION_TO, TIME_FROM, TIME_TO)
        values (user_pr_id, order_price, st_from, st_to, t_from, t_to)
        returning ORDERS_ID into id_order_out;
        pkg_msglog.P_LOG_WRN('orders_package_common.add_order()', 101, 'order added', 'order added');
        commit;
        order_pr_id := id_order_out;
    exception
        when others
            then DBMS_OUTPUT.PUT_LINE(sqlerrm || ' ' || sqlcode);
    end;
    procedure add_seat_to_order(p_order_id in varchar2, seat_pr_id in varchar2)
    as
        id_ticket_out TICKETS.TICKET_ID%type;
    begin
        update SEATS set IS_BOUGHT='2' where SEAT_ID = seat_pr_id;
        insert into TICKETS(SEAT_ID) values (seat_pr_id) returning TICKET_ID into id_ticket_out;
        insert into TICKETS_ORDERS(ORDER_ID, TICKET_ID) values (p_order_id, id_ticket_out);
        commit;
    end;
    procedure confirm_order(p_order_id in varchar2)
    as
    begin
        update USER_ORDERS_VIEW
        set IS_BOUGHT = '1'
        where ORDER_ID = p_order_id;
        commit;
    end;
    procedure get_user_cart_orders(user_pr_id in varchar2, status in char, u_orders_curs out sys_refcursor)
    as
    begin
        open u_orders_curs for
            select * from USER_ORDERS_VIEW where USER_PROFILE_ID = user_pr_id and IS_BOUGHT = status;
    end;

    procedure get_confirmed_orders(t_from date, t_to date, u_orders_curs out sys_refcursor)
    as
    begin
        open u_orders_curs for
            select*
            from USER_ORDERS_VIEW
            where IS_BOUGHT = '1'
              AND TIME_FROM between t_from and t_to
            order by TIME_FROM;
    end;
--TODO тригер на удаление order если время прошло
    procedure delete_order(p_order_id in varchar2)
    as
    begin
        update USER_ORDERS_VIEW set IS_BOUGHT = '0' where ORDER_ID = p_order_id;
        delete from ORDERS where ORDERS_ID = p_order_id;
        pkg_msglog.P_LOG_WRN('orders_package_common.delete_order()', 101, 'order deleted', 'order deleted');
        commit;
    exception
        when others
            then
                PKG_MSGLOG.P_LOG_ERR('orders_package_common.delete_order()', sqlcode, 'order not deleted ' || sqlerrm,
                                     'order not deleted');
                error_handling.RAISE_ERROR(-30000, sqlerrm);
    end;
end orders_package_common;

-- create job update_seats every day


select job_name, job_type, job_action, start_date, repeat_interval, next_run_date, enabled
from user_scheduler_jobs;
select job_name, state
from user_scheduler_jobs;