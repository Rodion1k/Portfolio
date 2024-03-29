alter user TRAIN_JET_PDB_ADMIN quota unlimited on TRAIN_JET_PDB_TS;

alter session set container=TRAIN_JET_PDB;
--- creation pdb
CREATE PLUGGABLE DATABASE TRAIN_JET_PDB ADMIN USER TRAIN_JET_PDB_ADMIN IDENTIFIED BY qwerty
    STORAGE (MAXSIZE UNLIMITED)
    DEFAULT TABLESPACE TRAIN_JET_PDB_TS
        DATAFILE 'TRAIN_JET_PDB_TS.DBF' SIZE 2 G AUTOEXTEND ON NEXT 100 M MAXSIZE 10 G
    PATH_PREFIX ='C:\app\oracle\oradata\TrainJetPDB\'
    FILE_NAME_CONVERT =('C:\app\oracle\oradata\ORCL\pdbseed\','C:\app\oracle\oradata\TrainJetPDB\');

DROP PLUGGABLE DATABASE TRAIN_JET_PDB INCLUDING DATAFILES;
alter pluggable database TRAIN_JET_PDB open;
alter pluggable database TRAIN_JET_PDB save state;

CREATE TABLESPACE TRAIN_JET_TS DATAFILE 'TRAIN_JET_TS.DBF' SIZE 2 G AUTOEXTEND ON NEXT 100 M MAXSIZE 10 G;

select * from v$pdbs;
select * from DBA_TABLESPACES;
CREATE TEMPORARY TABLESPACE TRAIN_JET_TS_TEMP TEMPFILE 'TRAIN_JET_TS_TEMP.DBF' SIZE 2 G AUTOEXTEND ON NEXT 100 M MAXSIZE 10 G;


--

SELECT *
FROM DBA_PDBS;

select * from DBA_USERS;
-- grant admin

grant create session,
    create table,
    create view,
    create procedure,
    create user,
    create role,
    create tablespace,
    create type,
    create sequence to TRAIN_JET_PDB_ADMIN;


-- create user(admin)

CREATE USER train_jet_admin IDENTIFIED BY qwerty
    DEFAULT TABLESPACE TRAIN_JET_PDB_TS_TEST
    TEMPORARY TABLESPACE TEMP
    QUOTA UNLIMITED ON TRAIN_JET_PDB_TS_TEST
    ACCOUNT UNLOCK;

-- create user
CREATE USER train_jet_user IDENTIFIED BY qwerty
    DEFAULT TABLESPACE TRAIN_JET_PDB_TS_TEST
    TEMPORARY TABLESPACE TEMP
    QUOTA UNLIMITED ON TRAIN_JET_PDB_TS_TEST
    ACCOUNT UNLOCK;

grant create session
    to train_jet_user;

grant create session,
    create table
    to train_jet_admin;


-- creatiion tables ----
CREATE TABLE TRAINS
(
    TRAIN_ID      RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    TRAIN_NAME    VARCHAR2(20)               NOT NULL,
    TRAIN_TYPE_ID RAW(16)                    NOT NULL,
    FOREIGN KEY (TRAIN_TYPE_ID) REFERENCES TRAIN_TYPES (TRAIN_TYPE_ID)
);
DROP TABLE TRAINS;
CREATE TABLE TRAIN_TYPES
(
    TRAIN_TYPE_ID   RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    TRAIN_TYPE      VARCHAR2(20)               NOT NULL,
    TRAIN_TYPE_COST NUMBER(10, 2)              NOT NULL
);
drop table TRAIN_TYPES;
COMMIT;

select * from TRAIN_TYPES;

CREATE TABLE WAGONS_TYPES
(
    TYPE_ID         RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    WAGON_TYPE_NAME VARCHAR2(20)               NOT NULL,
    WAGON_TYPE_SIZE NUMBER(10)                 NOT NULL,
    WAGON_TYPE_COST NUMBER(10, 2)              NOT NULL
);

CREATE TABLE WAGONS
(
    WAGON_ID      RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    WAGON_NAME    VARCHAR2(20)               NOT NULL,
    WAGON_TYPE_ID RAW(16)                    NOT NULL,
    FOREIGN KEY (WAGON_TYPE_ID) REFERENCES WAGGONS_TYPES (TYPE_ID),
    TRAIN_ID      RAW(16)                    NOT NULL,
    FOREIGN KEY (TRAIN_ID) REFERENCES TRAINS (TRAIN_ID)
);
DROP TABLE WAGGONS;

CREATE TABLE SEATS
(
    SEAT_ID     RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    SEAT_NUMBER NUMBER(2)                  NOT NULL,
    WAGON_ID    RAW(16),
    FOREIGN KEY (WAGON_ID) REFERENCES WAGGONS (WAGGON_ID),
    IS_BOUGHT   CHAR(1) DEFAULT '0'
        CHECK ( IS_BOUGHT IN ('0', '1') ) -- 0 FALSE, 1 TRUE �����
    -- forgin key wagon
);
DROP TABLE SEATS;
CREATE TABLE MOVEMENT_ROUTES -- ��������� ���� �� ������������� �������
(
    ROUTE_ID   RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    ROUTE_NAME VARCHAR2(20)               NOT NULL
);

DROP TABLE MOVEMENT_ROUTES;

CREATE TABLE MOVEMENT_ROUTES_TRAINS
(
    MOVEMENT_ROUTE_ID RAW(16),
    TRAIN_ID          RAW(16),
    FOREIGN KEY (TRAIN_ID) REFERENCES TRAINS (TRAIN_ID),
    FOREIGN KEY (MOVEMENT_ROUTE_ID) REFERENCES MOVEMENT_ROUTES (ROUTE_ID)
);
DROP TABLE MOVEMENT_ROUTES_TRAINS;

CREATE TABLE MOVEMENT_ROUTES_STATIONS
(
    MOVEMENT_ROUTE_ID RAW(16),
    STATION_ID        RAW(16),
    POSITION_NUMBER   NUMBER(5),
    POSITION_TIME     DATE NOT NULL,
    FOREIGN KEY (MOVEMENT_ROUTE_ID) REFERENCES MOVEMENT_ROUTES (ROUTE_ID),
    FOREIGN KEY (STATION_ID) REFERENCES STATIONS (STATION_ID)
);
DROP TABLE MOVEMENT_ROUTES_STATIONS;


CREATE TABLE STATIONS
(
    STATION_ID   RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    STATION_NAME VARCHAR2(20)               NOT NULL
);

DROP TABLE STATIONS;


CREATE TABLE TICKETS
(
    TICKET_ID RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    SEAT_ID   RAW(16)                    NOT NULL,
    FOREIGN KEY (SEAT_ID) REFERENCES SEATS (SEAT_ID)
);
DROP TABLE TICKETS;

CREATE TABLE TICKETS_ORDERS
(
    ORDER_ID  RAW(16) NOT NULL,
    TICKET_ID RAW(16) NOT NULL,
    FOREIGN KEY (TICKET_ID) REFERENCES TICKETS (TICKET_ID),
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS (ORDERS_ID)
);
DROP TABLE TICKETS_ORDERS;

CREATE TABLE ORDERS
(
    ORDERS_ID       RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    USER_PROFILE_ID RAW(16)                    NOT NULL,
    --���� �������
    FOREIGN KEY (USER_PROFILE_ID) REFERENCES USER_PROFILES (USER_PROFILE_ID)
);
DROP TABLE ORDERS;
-- users
CREATE TABLE USER_LOGINS
(
    USER_ID       RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    USER_LOGIN    VARCHAR2(50)               NOT NULL,
    USER_PASSWORD VARCHAR2(30)               NOT NULL
);
DROP TABLE USER_LOGINS;

CREATE TABLE USER_PROFILES
(
    USER_PROFILE_ID RAW(16)      NOT NULL PRIMARY KEY,
    USER_NAME       VARCHAR2(50) NOT NULL,
    USER_SURNAME    VARCHAR2(50) NOT NULL,
    USER_PATRONYMIC VARCHAR2(50) NOT NULL,
    USER_EMAIL      VARCHAR2(50) NOT NULL,
    USER_PHONE      VARCHAR2(50) NOT NULL,
    USER_PASSPORT   VARCHAR2(50) NOT NULL,
    USER_ROLE       VARCHAR2(50) NOT NULL,
    FOREIGN KEY (USER_PROFILE_ID) REFERENCES USER_LOGINS (USER_ID)
);

DROP TABLE USER_PROFILES;

alter table user_logins
modify user_password varchar2(100) ;

INSERT INTO TRAIN_TYPES(TRAIN_TYPE, TRAIN_TYPE_COST)
VALUES ('high-speed', 100);
INSERT INTO TRAIN_TYPES(TRAIN_TYPE, TRAIN_TYPE_COST)
VALUES ('high-speed2', 100);
INSERT INTO TRAIN_TYPES(TRAIN_TYPE, TRAIN_TYPE_COST)
VALUES ('high-speed3', 100);

insert into trains(train_name, train_type_id)
VALUES ('train1', (select train_type_id from train_types where train_type = 'high-speed'));
insert into trains(train_name, train_type_id)
VALUES ('train2', (select train_type_id from train_types where train_type = 'high-speed'));
insert into trains(train_name, train_type_id)
VALUES ('train3', (select train_type_id from train_types where train_type = 'high-speed'));

