DELETE
FROM TRAINS;
DELETE
FROM TRAIN_TYPES;


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

-- DECLARE
--     tr_type
--         TRAIN_TYPES.TRAIN_TYPE_ID%TYPE;
-- BEGIN
--     SELECT TRAIN_TYPE_ID
--     INTO tr_type
--     FROM TRAIN_TYPES
--     WHERE TRAIN_TYPE = 'high-speed';
--     INSERT INTO TRAINS(TRAIN_NAME, TRAIN_TYPE_ID)
--     VALUES ('train1', tr_type);
-- end;
--TODO не работает
