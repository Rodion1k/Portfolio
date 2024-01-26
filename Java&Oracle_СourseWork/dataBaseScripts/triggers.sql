create or replace trigger grant_revoke_trigger
    after grant or revoke
    on SCHEMA
begin
    pkg_msglog.P_LOG_WRN('','','Grant/Revoke');
end;