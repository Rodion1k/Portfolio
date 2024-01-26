----profiles----
CREATE PROFILE pf_user LIMIT
    PASSWORD_LIFE_TIME 360
    SESSIONS_PER_USER 300
    FAILED_LOGIN_ATTEMPTS 7
    PASSWORD_LOCK_TIME 1
    PASSWORD_REUSE_TIME 10
    PASSWORD_GRACE_TIME DEFAULT
    CONNECT_TIME 180
    IDLE_TIME 30;

CREATE PROFILE pf_admin LIMIT
    PASSWORD_LIFE_TIME 360
    SESSIONS_PER_USER 5
    FAILED_LOGIN_ATTEMPTS 7
    PASSWORD_LOCK_TIME 1
    PASSWORD_REUSE_TIME 10
    PASSWORD_GRACE_TIME DEFAULT
    CONNECT_TIME 180
    IDLE_TIME 30;

-- select roles and their privileges
select * from DBA_SYS_PRIVS;

-- select count of sessions per user
select count(*) from v$session where username='train_jet_admin';

---roles---
CREATE ROLE role_user;
GRANT CREATE SESSION TO role_user;
--grants procedures

CREATE ROLE role_admin;
GRANT CREATE SESSION TO role_admin;

grant  role_admin to train_jet_admin;
grant  role_user to train_jet_user;


CREATE USER train_jet_admin IDENTIFIED BY qwerty
    DEFAULT TABLESPACE TRAIN_JET_PDB_TS
    TEMPORARY TABLESPACE TEMP
    PROFILE pf_admin
    ACCOUNT UNLOCK
    QUOTA UNLIMITED ON TRAIN_JET_PDB_TS;

CREATE USER train_jet_user IDENTIFIED BY qwerty
    DEFAULT TABLESPACE TRAIN_JET_PDB_TS
    TEMPORARY TABLESPACE TEMP
    PROFILE pf_user
    ACCOUNT UNLOCK
    QUOTA UNLIMITED ON TRAIN_JET_PDB_TS;
