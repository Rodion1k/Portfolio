create table message_log
(
    id         RAW(16) DEFAULT SYS_GUID() not null,
    sessionid  number(38)  not null,
    msgtype    varchar2(3) not null,
    objname    varchar2(60)   default null,
    insertdate date           default sysdate,
    msgcode    varchar2(10)   default null,
    msgtext    varchar2(4000) default null,
    paramvalue varchar2(4000) default null,
    constraint pk_messagelog_id primary key (id)
)
    partition by range (insertdate)
    interval (numtoyminterval(3, 'MONTH'))
(
    partition p1 values less than (to_date('01.12.2022', 'DD.MM.YYYY'))
);

drop table message_log;
create or replace package pkg_msglog
as
    procedure p_log_err(p_objname in varchar2,
                        p_msgcode in varchar2,
                        p_msgtext in varchar2 default null,
                        p_paramvalue in varchar2 default null);

    procedure p_log_wrn(p_objname in varchar2,
                        p_msgcode in varchar2,
                        p_msgtext in varchar2 default null,
                        p_paramvalue in varchar2 default null);

    procedure p_insert_log(p_msgtype_ in varchar2,
                           p_sessionid_ in number,
                           p_objname_ in varchar2,
                           p_insertdate_ in date,
                           p_msgcode_ in varchar2,
                           p_msgtext_ in varchar2 default null,
                           p_paramvalue_ in varchar2 default null);
end pkg_msglog;
/
create or replace package body pkg_msglog
as
    v_sid number; -- unique SID current session

    procedure p_log_err(p_objname in varchar2,
                        p_msgcode in varchar2,
                        p_msgtext in varchar2,
                        p_paramvalue in varchar2)
        is
    begin
        p_insert_log(p_msgtype_ => 'ERR',
                     p_sessionid_ => v_sid,
                     p_objname_ => p_objname,
                     p_insertdate_ => sysdate,
                     p_msgcode_ => p_msgcode,
                     p_msgtext_ => p_msgtext,
                     p_paramvalue_ => p_paramvalue);
    end p_log_err;

    procedure p_log_wrn(p_objname in varchar2,
                        p_msgcode in varchar2,
                        p_msgtext in varchar2,
                        p_paramvalue in varchar2)
        is
    begin
        p_insert_log(p_msgtype_ => 'WRN',
                     p_sessionid_ => v_sid,
                     p_objname_ => p_objname,
                     p_insertdate_ => sysdate,
                     p_msgcode_ => p_msgcode,
                     p_msgtext_ => p_msgtext,
                     p_paramvalue_ => p_paramvalue);
    end p_log_wrn;

    procedure p_insert_log(p_msgtype_ in varchar2,
                           p_sessionid_ in number,
                           p_objname_ in varchar2,
                           p_insertdate_ in date,
                           p_msgcode_ in varchar2,
                           p_msgtext_ in varchar2,
                           p_paramvalue_ in varchar2)
        is
        v_id message_log.id%type;
        pragma autonomous_transaction;
    begin
        insert into message_log(msgtype,
                                sessionid,
                                objname,
                                insertdate,
                                msgcode,
                                msgtext,
                                paramvalue)
        values (p_msgtype_,
                p_sessionid_,
                p_objname_,
                p_insertdate_,
                p_msgcode_,
                p_msgtext_,
                p_paramvalue_)
        return id
            into v_id;
        commit;
    end p_insert_log;

begin
    v_sid := SYS_CONTEXT('USERENV', 'SESSIONID');
end pkg_msglog;