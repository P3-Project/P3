-- Physical tables in the restaurant: the table's number label and how many seats it has
-- Called it 'restaurant_table' because Table is a reserved word in SQL
CREATE TABLE restaurant_table (
    table_number Integer PRIMARY KEY, -- The number on the table, e.g. 1-20
    seats Integer NOT NULL CHECK (seats > 0) -- Must have atleast one seats
);


-- TEST DATA
INSERT INTO restaurant_table (table_number, seats) VALUES
    (1,2),
    (2,2),
    (3,4),
    (4,4),
    (5,6);