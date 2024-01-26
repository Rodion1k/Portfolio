create or replace package general_package
as
    max_int constant integer := 99999999999999999999999999999999999999;
    procedure get_size(p_table in varchar2, p_size out number);
end general_package;

create or replace package body general_package
as
    procedure get_size(p_table in varchar2, p_size out number) is
        size_cursor sys_refcursor;
    begin
        open size_cursor for
            'select count(*) from ' || p_table;
        fetch size_cursor into p_size;
        close size_cursor;
    exception
        when exceptions.invalid_table_name then
            error_handling.raise_invalid_table_name('table or view with name: ' || p_table || ' does not exist');
    end get_size;

end general_package;

declare
    v_size number;
begin
    general_package.get_size('FLIGHTS_VIEW', v_size);
    dbms_output.put_line(v_size);
end;