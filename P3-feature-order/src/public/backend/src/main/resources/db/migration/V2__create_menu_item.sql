CREATE TABLE menu_item (

item_id             SERIAL PRIMARY KEY,
name                TEXT, 
price               INTEGER,
dish_description    TEXT,
station             TEXT,
out_of_stock        BOOLEAN, 
category            TEXT,
prep_time           INTEGER
);