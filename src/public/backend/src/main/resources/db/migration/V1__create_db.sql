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

CREATE TABLE    customer (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) UNIQUE
);


CREATE TABLE order_item (
order_item_id SERIAL PRIMARY KEY,
order_id INTEGER NOT NULL,
item_id INTEGER NOT NULL,
quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity>0),
note TEXT,
sent_at TIMESTAMPTZ,
completed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_order_item_order_id ON order_item(order_id);

/* Table booking system */
CREATE TABLE reservation (
    reservation_id   SERIAL PRIMARY KEY,
    customer_name    TEXT NOT NULL,
    customer_phone   TEXT,                  /* text ikke numre */
    res_date         DATE NOT NULL,
    res_time         TIME NOT NULL,
    duration         INTEGER NOT NULL DEFAULT 120,  
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    special_request  TEXT,
    status           TEXT NOT NULL DEFAULT 'booked'
        CHECK (status IN ('booked','seated','completed','cancelled','no_show'))
);

/* TEST DATA */
INSERT INTO reservation (customer_name, customer_phone, res_date, res_time, number_of_guests, special_request) VALUES
    ('Jens Jensensen', '98246566', CURRENT_DATE, '18:00', 4, NULL),
('Anna Jensen', '12345678', CURRENT_DATE, '19:30', 2, 'Fødselsdag');


/* Forbinder et reservation til et fysisk bord, et reservation kan kombinerer flere border sammen */
CREATE TABLE reservation_table (
    reservation_id INTEGER NOT NULL REFERENCES reservation(reservation_id) ON DELETE CASCADE,
    table_number   INTEGER NOT NULL REFERENCES restaurant_table(table_number),
    PRIMARY KEY (reservation_id, table_number)
);

CREATE TABLE staff (
    staff_id      INTEGER PRIMARY KEY,
    staff_number  VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    active        BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO staff (staff_id, staff_number, name, role, active) VALUES
(1, 'S001', 'Tahir Kayatuz', 'MANAGER', TRUE),
(2, 'S002', 'Mads Nielsen',  'WAITER',  TRUE),
(3, 'S003', 'Sara Hansen',   'KITCHEN', TRUE),
(4, 'S004', 'Omar Ali',      'KITCHEN', TRUE),
(5, 'S005', 'Bilal Kayatuz', 'KITCHEN', FALSE);
