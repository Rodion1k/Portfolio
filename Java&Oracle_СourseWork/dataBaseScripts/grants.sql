grant create session,
    create table,
    create view,
    create procedure,
    create user,
    create role,
    create profile,
    create tablespace,
    create type,
    create public synonym,
    drop user,
    drop profile,
    create sequence to TRAIN_JET_PDB_ADMIN with admin option;
alter session set container=TRAIN_JET_PDB;

select * from dba_users;

grant dba to TRAIN_JET_PDB_ADMIN;

grant read, write on directory ORACLE_BASE to TRAIN_JET_PDB_ADMIN;
GRANT SCHEDULER_ADMIN TO TRAIN_JET_PDB_ADMIN;
select * from dba_DIRECTORIES;

grant execute on TRAIN_JET_PDB_ADMIN.USER_PACKAGE_ADMIN to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.train_package_admin to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.train_package_common to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.waggon_package_admin to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.WAGON_PACKAGE_COMMON to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.MOVEMENT_ROUTE_PACKAGE_ADMIN to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.MOVEMENT_ROUTE_PACKAGE_COMMON to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.STATIONS_PACKAGE_ADMIN to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.STATIONS_PACKAGE_COMMON to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.GENERAL_PACKAGE to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.USER_PACKAGE_COMMON to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.SEAT_PACKAGE_COMMON to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.ORDERS_PACKAGE_COMMON to TRAIN_JET_ADMIN;
grant execute on TRAIN_JET_PDB_ADMIN.PACKAGE_STATISTICS to TRAIN_JET_ADMIN;





grant execute on TRAIN_JET_PDB_ADMIN.train_package_common to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.WAGON_PACKAGE_COMMON to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.STATIONS_PACKAGE_COMMON to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.MOVEMENT_ROUTE_PACKAGE_COMMON to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.GENERAL_PACKAGE to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.USER_PACKAGE_COMMON to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.SEAT_PACKAGE_COMMON to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.ORDERS_PACKAGE_COMMON to TRAIN_JET_USER;
grant execute on TRAIN_JET_PDB_ADMIN.PACKAGE_STATISTICS to TRAIN_JET_USER;




