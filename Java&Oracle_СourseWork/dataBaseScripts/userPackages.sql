----------- user packages --------------
create or replace package user_package_admin
as
    procedure get_user_login_by_login(login in varchar2, u_logins_curs out sys_refcursor);
    procedure add_user_login(login in varchar2, password in varchar2, role in varchar2, id_out out varchar2);
    procedure add_user_profile(id in varchar2, name in varchar2, surname in varchar2, patronymic in varchar2,
                               email in varchar2, passport in varchar2);
end user_package_admin;



create or replace package body
    user_package_admin
as
    procedure get_user_login_by_login(login in varchar2, u_logins_curs out sys_refcursor)
    as
    begin
        open u_logins_curs for
            select * from USER_LOGINS where USER_LOGIN = login;

    end;

    procedure add_user_login(login in varchar2, password in varchar2, role in varchar2, id_out out varchar2)
    as
    begin
        select USER_ID into id_out from USER_LOGINS where USER_LOGIN = login;
        if id_out is not null then
            error_handling.raise_already_exists('User with login ' || login || ' already exists');
        end if;

    exception
        when no_data_found then
            -- insert new user and return id of new user
            insert into USER_LOGINS (USER_LOGIN, USER_PASSWORD, USER_ROLE)
            values (login, password, role)
            returning USER_ID into id_out;
            commit;
    end;
    procedure add_user_profile(id in varchar2, name in varchar2, surname in varchar2, patronymic in varchar2,
                               email in varchar2, passport in varchar2)
    as
    begin
        insert into USER_PROFILES(USER_PROFILE_ID, USER_NAME, USER_SURNAME, USER_PATRONYMIC, USER_EMAIL,
                                  USER_PASSPORT)
        values (id, name, surname, patronymic, email, passport);
        commit;
    exception

        when exceptions.ERR_ID_NOT_FOUND then
            error_handling.raise_id_not_found('User with id ' || id || ' not found');
    end;

end user_package_admin;

create or replace view USER_INFO_VIEW
as
select USER_ID,
       USER_LOGIN,
       USER_ROLE,
       USER_NAME,
       USER_SURNAME,
       USER_PATRONYMIC,
       USER_EMAIL,
       USER_PASSPORT
FROM USER_LOGINS
         JOIN USER_PROFILES UP on USER_LOGINS.USER_ID = UP.USER_PROFILE_ID;
create or replace package user_package_common
as
    procedure get_user_info(id in varchar2, u_info_curs out sys_refcursor);
end user_package_common;

create or replace package body user_package_common
as
    procedure get_user_info(id in varchar2, u_info_curs out sys_refcursor)
    as
    begin
        open u_info_curs
            for select * from USER_INFO_VIEW where USER_ID = id;
    end;
end user_package_common;

-----test procedures ------

declare
    out_id varchar2(100);
begin
    --         user_package_admin.add_user_login('admin2', 'test', 'admin', out_id);
--     DBMS_OUTPUT.PUT_LINE('id = ' || out_id);
    user_package_admin.add_user_profile('EE5E493245B002E1E053020013AC1227', 'test', 'test', 'test', 'test', 'test');
end;
