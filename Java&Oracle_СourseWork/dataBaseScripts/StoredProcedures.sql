alter session set "_ORACLE_SCRIPT"= true;

create user train_jet_admin identified by qwerty;
grant create session to train_jet_admin;

create user train_jet_user identified by qwerty;
grant create session to train_jet_user;

--quota for tablespace to user
alter user train_jet_admin quota unlimited on TRAIN_JET_PDB_TS;
alter user train_jet_user quota unlimited on TRAIN_JET_PDB_TS;


select *
from user_TABLESPACES;


drop user train_jet_admin;
grant create session to train_jet_admin;


drop user train_jet_user;
drop user TRAIN_JET_ADMIN;


