/* Forbinder et reservation til et fysisk bord, et reservation kan kombinerer flere border sammen */
CREATE TABLE reservation_table (
    reservation_id INTEGER NOT NULL REFERENCES reservation(reservation_id) ON DELETE CASCADE,
    table_number   INTEGER NOT NULL REFERENCES restaurant_table(table_number),
    PRIMARY KEY (reservation_id, table_number)
);