----------- seats packages -------------- TODO создать
create or replace view
    WAGGON_SEATS_VIEW
as
select SEAT_ID,
       SEAT_NUMBER,
       WAGGON_ID,
       IS_BOUGHT,
       T.TRAIN_NAME,
       MRT.MOVEMENT_ROUTE_ID
from SEATS
         JOIN WAGGONS W on W.WAGGON_ID = SEATS.WAGON_ID
         JOIN TRAINS T on T.TRAIN_ID = W.TRAIN_ID
         JOIN MOVEMENT_ROUTES_TRAINS MRT on T.TRAIN_ID = MRT.TRAIN_ID
with read only;


create or replace package seat_package_admin
as
    procedure add_seat(wag_id in varchar2, seat_num in number);
    procedure delete_seat(wag_id in varchar2, seat_num in number);
end seat_package_admin;

create or replace package body seat_package_admin
as

    procedure add_seat(wag_id in varchar2, seat_num in number)-- updateSeat
    as
        st_id SEATS.SEAT_ID%TYPE;
    begin
        insert into SEATS(WAGON_ID, SEAT_NUMBER) values (wag_id, seat_num);
        commit;
        select SEAT_ID into st_id from SEATS where WAGON_ID = wag_id and SEAT_NUMBER = seat_num;
        insert into TICKETS(SEAT_ID) VALUES (st_id);
    end;

    procedure delete_seat(wag_id in varchar2, seat_num in number)
    as
    begin
        delete from SEATS where WAGON_ID = wag_id and SEAT_NUMBER = seat_num;
        commit;
    end;
end seat_package_admin;

create or replace package seat_package_common
as
    procedure get_seats_by_waggon_id(wag_id in varchar2, tr_name in varchar2, r_id in varchar2,
                                     seat_curs out sys_refcursor);
    procedure update_seat(s_id in varchar2, p_is_bought in char);

end seat_package_common;

create or replace package body seat_package_common
as
    procedure get_seats_by_waggon_id(wag_id in varchar2, tr_name in varchar2, r_id in varchar2,
                                     seat_curs out sys_refcursor)
    as
    begin
        open seat_curs for
            select SEAT_ID, SEAT_NUMBER, WAGGON_ID, IS_BOUGHT
            from WAGGON_SEATS_VIEW
            where WAGGON_ID = wag_id
              and TRAIN_NAME = tr_name
              and MOVEMENT_ROUTE_ID = r_id
            order by SEAT_NUMBER;
    end;

    procedure update_seat(s_id in varchar2, p_is_bought in char)
    as
    begin
        update SEATS set IS_BOUGHT = p_is_bought where SEAT_ID = s_id;
        commit;
    end;

end seat_package_common;
