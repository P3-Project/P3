-- =====================================================================
-- V1: Database structure for PPSH (Pandrup Pizza & Steak House)
-- ONLY tables, constraints and indexes. All test data lives in R__test_data.sql.
-- Once this is on main, never edit it: changes go in V2__, V3__ ...
-- =====================================================================


-- ---------- Restaurant layout ----------

-- Physical tables in the restaurant.
-- Called 'restaurant_table' because TABLE is a reserved word in SQL.
CREATE TABLE restaurant_table (
    table_number INTEGER PRIMARY KEY,                  -- the number on the table, chosen by the restaurant
    seats        INTEGER NOT NULL CHECK (seats > 0)    -- must have at least one seat
);


-- ---------- Staff ----------

CREATE TABLE staff (
    staff_id     INTEGER PRIMARY KEY,
    staff_number VARCHAR(50)  NOT NULL UNIQUE,         -- e.g. 'S001'
    name         VARCHAR(100) NOT NULL,
    role         VARCHAR(20)  NOT NULL
        CHECK (role IN ('MANAGER', 'WAITER', 'KITCHEN')),
    active       BOOLEAN      NOT NULL DEFAULT TRUE
);


-- ---------- Menu ----------

CREATE TABLE menu_item (
    item_id          SERIAL PRIMARY KEY,
    name             TEXT    NOT NULL,
    price            INTEGER NOT NULL CHECK (price >= 0),   -- whole kroner
    dish_description TEXT,
    station          TEXT    NOT NULL
        CHECK (station IN ('PIZZA', 'GRILL')),              -- which kitchen makes it
    out_of_stock     BOOLEAN NOT NULL DEFAULT FALSE,
    category         TEXT    NOT NULL,                       -- e.g. 'Pizza', 'Burgere'
    prep_time        INTEGER CHECK (prep_time > 0)           -- minutes, optional
);


-- ---------- Customers ----------

CREATE TABLE customer (
    customer_id    SERIAL PRIMARY KEY,
    customer_name  VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) UNIQUE
);


-- ---------- Orders ----------

-- One order = one table's bill. Called 'customer_order' because ORDER is a reserved word.
-- Status is derived from the timestamps: both NULL = OPEN.
CREATE TABLE customer_order (
    order_id     SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL REFERENCES restaurant_table(table_number),
    staff_id     INTEGER NOT NULL REFERENCES staff(staff_id),   -- the waiter who took it
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at    TIMESTAMPTZ,                                   -- NULL until the bill is paid
    cancelled_at TIMESTAMPTZ                                    -- NULL unless cancelled
);

-- One line on an order, e.g. "2x Margherita, uden oregano"
CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id      INTEGER NOT NULL REFERENCES customer_order(order_id) ON DELETE CASCADE,
    item_id       INTEGER NOT NULL REFERENCES menu_item(item_id),
    quantity      INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    note          TEXT,                                          -- allergies, cooking wishes etc.
    sent_at       TIMESTAMPTZ,                                   -- NULL until sent to the kitchen
    completed     BOOLEAN NOT NULL DEFAULT FALSE                 -- set by the kitchen
);

CREATE INDEX idx_order_item_order_id ON order_item(order_id);


-- ---------- Reservations ----------

-- Registered by waiters (customers book by phone or in person)
CREATE TABLE reservation (
    reservation_id   SERIAL PRIMARY KEY,
    customer_name    TEXT    NOT NULL,
    customer_phone   TEXT,                                       -- text, not a number (leading zeros, +45)
    res_date         DATE    NOT NULL,
    res_time         TIME    NOT NULL,
    duration         INTEGER NOT NULL DEFAULT 120,               -- minutes
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    special_request  TEXT,
    status           TEXT    NOT NULL DEFAULT 'booked'
        CHECK (status IN ('booked', 'seated', 'completed', 'cancelled', 'no_show'))
);

-- Links a reservation to physical tables; one reservation can combine several tables
CREATE TABLE reservation_table (
    reservation_id INTEGER NOT NULL REFERENCES reservation(reservation_id) ON DELETE CASCADE,
    table_number   INTEGER NOT NULL REFERENCES restaurant_table(table_number),
    PRIMARY KEY (reservation_id, table_number)
);