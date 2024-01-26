create or replace package import_export_json
as
    procedure exportUserOrdersViewToJSON;
    procedure importWaggonTypesFromJSON;
end import_export_json;

create or replace package body import_export_json
as
    procedure exportUserOrdersViewToJSON
    as
        file1 utl_file.file_type;
    begin

        file1 := utl_file.fopen('ORACLE_BASE', 'users_orders.json', 'w');--TODO взять для экспорта view
        for c in (select JSON_OBJECT('SEAT_NUMBER' value SEAT_NUMBER
                             , 'WAGGON_NAME' value WAGGON_NAME
                             , 'WAGGON_TYPE_NAME' value WAGGON_TYPE_NAME
                             , 'TRAIN_NAME' value TRAIN_NAME
                             , 'TRAIN_TYPE' value TRAIN_TYPE
                             , 'USER_NAME' value USER_NAME
                             , 'IS_BOUGHT' value IS_BOUGHT
                             , 'PRICE' value PRICE
                             , 'ORDER_ID' value ORDER_ID
                             , 'STATION_FROM' value STATION_FROM
                             , 'STATION_TO' value STATION_TO
                             , 'TIME_FROM' value TIME_FROM
                             , 'TIME_TO' value TIME_TO
                             , 'ROUTE_NAME' value ROUTE_NAME
                             , 'USER_PROFILE_ID' value USER_PROFILE_ID
                             ) as json
                  from USER_ORDERS_VIEW)
            loop
                utl_file.put_line(file1, c.json);
            end loop;
        pkg_msglog.P_LOG_WRN('import_export_json.exportStationsToJSON', 101, 'Exported USER_ORDERS_VIEW types to JSON file');
        commit;
        utl_file.fclose(file1);
    exception
        when others
            then
                pkg_msglog.P_LOG_ERR('import_export_json.exportUserOrdersViewToJSON', SQLCODE, SQLERRM);
                commit;
                utl_file.fclose(file1);

    end exportUserOrdersViewToJSON;


    procedure importWaggonTypesFromJSON as
        file1 utl_file.file_type;
        line  varchar2(32767);
    begin
        file1 := utl_file.fopen('ORACLE_BASE', 'waggon_types2.json', 'r');
        loop
            begin
                utl_file.GET_LINE(file1, line);
                DBMS_OUTPUT.PUT_LINE(line);
                merge into WAGGONS_TYPES
                using (select json_value(line, '$.TYPE_ID')          as id,
                              json_value(line, '$.WAGGON_TYPE_NAME') as wagName,
                              json_value(line, '$.WAGGON_TYPE_SIZE') as w_size,
                              json_value(line, '$.WAGGON_TYPE_COST') as w_cost
                       from dual) src
                on (WAGGONS_TYPES.WAGGON_TYPE_NAME = src.wagName)
                when not matched then
                    insert (WAGGON_TYPE_NAME, WAGGON_TYPE_SIZE, WAGGON_TYPE_COST)
                    values (src.wagName, src.w_size, src.w_cost);
            exception
                when others then
                    exit;
            end;
        end loop;
        pkg_msglog.P_LOG_WRN('import_export_json.importStationsFromJSON', 101, 'Imported waggon types from JSON file');
        commit;
        utl_file.fclose(file1);
    end importWaggonTypesFromJSON;

end import_export_json;

begin
    import_export_json.exportUserOrdersViewToJSON;
end;

SELECT * FROM USER_ORDERS_VIEW;

delete
from WAGGONS_TYPES
where WAGGON_TYPE_COST = 0;
commit;

select *
from WAGGONS_TYPES where WAGGON_TYPE_COST = 0;

begin
    import_export_json.importWaggonTypesFromJSON;
end;
select *
from WAGGONS_TYPES;

