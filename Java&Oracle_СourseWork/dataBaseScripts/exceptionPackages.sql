create or replace package exceptions
as

    err_num_data_not_found constant number := -20001;
    exc_data_not_found exception;
    pragma exception_init (exc_data_not_found, -20001);

    err_num_already_exists constant number := -20002;
    exc_already_exists exception;
    pragma exception_init (exc_already_exists, -1);

    err_num_id_not_found constant number := -20003;
    err_id_not_found exception;
    pragma exception_init (err_id_not_found, -2291);
    err_invalid_table_name constant number := -20004;
    invalid_table_name exception;
    pragma exception_init (invalid_table_name, -942);

    err_invalid_data constant number := -20005;
    invalid_data exception;
end exceptions;

create or replace package error_handling
as
    procedure raise_already_exists(message varchar2);
    procedure raise_id_not_found(message varchar2);
    procedure raise_data_not_found(message varchar2);
    procedure raise_invalid_table_name(message varchar2);
    procedure raise_error(err_num number, message varchar2);
    procedure raise_invalid_input(message varchar2);
end error_handling;


create or replace package body error_handling
as
    procedure raise_already_exists(message varchar2) is
    begin
        raise_application_error(exceptions.err_num_already_exists, message);
    end;

    procedure raise_id_not_found(message varchar2) is
    begin
        raise_application_error(exceptions.err_num_id_not_found, message);
    end;

    procedure raise_data_not_found(message varchar2) is
    begin
        raise_application_error(exceptions.err_num_data_not_found, message);
    end;
    procedure raise_error(err_num number, message varchar2) is
    begin
        raise_application_error(err_num, message);
    end;
    procedure raise_invalid_table_name(message varchar2) is
    begin
        raise_application_error(exceptions.err_invalid_table_name, message);
    end;
    procedure raise_invalid_input(message varchar2) is
    begin
        raise_application_error(exceptions.err_invalid_data, message);
    end;
end error_handling;



