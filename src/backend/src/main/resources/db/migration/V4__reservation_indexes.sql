
-- Late arrival checks, waiter's view 
-- and daily guest count all, check of reservation date, so res_date recieves an index.
CREATE INDEX idx_reservation_res_date ON reservation (res_date);



-- Free tables check looks up reservation_table by (table_number). The primary key (table_number, reservation_id) can't be used for it 
-- due to (table_number) is its second column.
CREATE INDEX idx_reservation_table_table_number ON reservation_table (table_number);