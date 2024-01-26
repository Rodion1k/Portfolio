alter session set container = train_jet_pdb;
create or replace procedure insert_into_statistics
as
    v_date  date;
    v_count number;
begin
    select sysdate into v_date from dual;
    select count(*) into v_count from train_jet_pdb_admin.USER_ORDERS_VIEW where IS_BOUGHT = '1' and TIME_FROM < v_date;
    update train_jet_pdb_admin.USER_ORDERS_VIEW set IS_BOUGHT='0' where TIME_FROM < v_date;
    delete from ORDERS where TIME_FROM < v_date;
    insert into train_jet_pdb_admin.STATISTICS(DATE_FROM, COUNT) values (v_date, v_count);
    commit;
end;

drop procedure insert_into_statistics;
-- create table STATISTICS
create table STATISTICS
(
    DATE_FROM date,
    COUNT     number(10)
);

select *
from STATISTICS;

delete
from train_jet_pdb_admin.STATISTICS
where COUNT = 2;

select *
from ORDERS
where TIME_FROM < sysdate;

select *
from train_jet_pdb_admin.USER_ORDERS_VIEW
where IS_BOUGHT = '1'
  and TIME_FROM < sysdate;


insert into STATISTICS(DATE_FROM, COUNT)
values (to_date('14.11.2022 17:00:00', 'dd.mm.yyyy hh24:mi:ss'), 2);

insert into STATISTICS(DATE_FROM, COUNT)
values (to_date('15.11.2022 17:00:00', 'dd.mm.yyyy hh24:mi:ss'), 43);

insert into STATISTICS(DATE_FROM, COUNT)
values (to_date('16.11.2022 17:00:00', 'dd.mm.yyyy hh24:mi:ss'), 22);

insert into STATISTICS(DATE_FROM, COUNT)
values (to_date('17.11.2022 17:00:00', 'dd.mm.yyyy hh24:mi:ss'), 12);

insert into STATISTICS(DATE_FROM, COUNT)
values (to_date('18.11.2022 17:00:00', 'dd.mm.yyyy hh24:mi:ss'), 63);


select *
from train_jet_pdb_admin.STATISTICS;
insert into train_jet_pdb_admin.STATISTICS
values (sysdate, 0);



begin
    train_jet_pdb_admin.insert_into_statistics;
end;

--create job which run insert_into_statistics every day
begin
    dbms_scheduler.create_job(
            job_name => 'insert_into_statistics3',
            job_type => 'STORED_PROCEDURE',
            job_action => 'insert_into_statistics',
            repeat_interval => 'FREQ=DAILY;BYHOUR=0;BYMINUTE=0;BYSECOND=0',
            enabled => TRUE,
            comments => 'insert_into_statistics'
        );
end;

-- run job
begin
    dbms_scheduler.run_job('insert_into_statistics3');
end;

begin
    dbms_scheduler.drop_job('insert_into_statistics3', true);
end;

select job_name, job_type, job_action, start_date, repeat_interval, next_run_date, enabled
from user_scheduler_jobs;
select job_name, state
from user_scheduler_jobs;


create or replace package package_statistics
as
    procedure get_statistics(p_date_from date, p_date_to date, p_count_cursor out sys_refcursor);

end package_statistics;

create or replace package body package_statistics
as
    procedure get_statistics(p_date_from date, p_date_to date, p_count_cursor out sys_refcursor)
    as
    begin
        open p_count_cursor for
            select *
            from STATISTICS
            where DATE_FROM between p_date_from and p_date_to;
    end;
end package_statistics;

    -- set max runnig jobs

alter system set job_queue_processes =9;