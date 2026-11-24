-- =====================================================================
-- R__test_data: ALL dummy data for development.
-- Repeatable: Flyway reruns this file every time its content changes,
-- always after the V__ files. It wipes the data first, so it can be
-- edited freely without checksum errors or docker wipes.
-- =====================================================================

-- Empty every table and reset all SERIAL ids back to 1
TRUNCATE order_item, customer_order, reservation_table, reservation,
         menu_item, customer, staff, restaurant_table
    RESTART IDENTITY CASCADE;


-- ---------- Tables ----------

INSERT INTO restaurant_table (table_number, seats) VALUES
    (1, 2), (2, 2), (3, 4), (4, 4), (5, 6),
    (6, 4), (7, 4), (8, 6), (9, 8), (10, 2);


-- ---------- Staff ----------

INSERT INTO staff (staff_id, staff_number, name, role, active) VALUES
    (1, 'S001', 'Tahir Kayatuz', 'MANAGER', TRUE),
    (2, 'S002', 'Mads Nielsen',  'WAITER',  TRUE),
    (3, 'S003', 'Sara Hansen',   'KITCHEN', TRUE),
    (4, 'S004', 'Omar Ali',      'KITCHEN', TRUE),
    (5, 'S005', 'Bilal Kayatuz', 'KITCHEN', FALSE);

-- ---------- Reservations ----------

-- Covers every status, so the availability query can be checked by hand:
-- cancelled and no_show must release their table again, and reservation 5
-- uses two tables, which is the only row that exercises reservation_table
-- with more than one row per reservation.
INSERT INTO reservation (customer_name, customer_phone, res_date, res_time,
                         number_of_guests, special_request, duration, status) VALUES
    ('Jens Jensen',     '98246566', CURRENT_DATE, '17:00', 4, NULL,            120, 'completed'),  -- 1
    ('Anna Jensen',     '12345678', CURRENT_DATE, '18:00', 2, 'Fødselsdag',    120, 'seated'),     -- 2
    ('Mette Nielsen',   '20304050', CURRENT_DATE, '19:00', 2, NULL,            120, 'booked'),     -- 3
    ('Peter Madsen',    '23334353', CURRENT_DATE, '19:30', 6, NULL,            120, 'cancelled'),  -- 4
    ('Familien Hansen', '24344454', CURRENT_DATE, '20:00', 8, 'Stort selskab', 150, 'booked'),     -- 5
    ('Lars Pedersen',   '25354555', CURRENT_DATE, '18:30', 4, NULL,            120, 'no_show');    -- 6

INSERT INTO reservation_table (reservation_id, table_number) VALUES
    (1, 6),            -- Jens: table 6 (4 seats), already finished
    (2, 10),           -- Anna: table 10 (2 seats), sitting there now
    (3, 1),            -- Mette: table 1 (2 seats)
    (4, 5),            -- Peter: table 5 (6 seats) - cancelled, so table 5 is free
    (5, 9), (5, 8),    -- Familien Hansen: tables 9 + 8 pushed together
    (6, 7);            -- Lars: table 7 (4 seats) - no-show, so table 7 is free


-- ---------- Orders (one open order per table, like the OrderService requires) ----------

INSERT INTO customer_order (table_number, staff_id) VALUES
    (1, 2),   -- order 1: grill only
    (3, 2),   -- order 2: mixed pizza + grill
    (4, 2),   -- order 3: grill, 12 minutes old (yellow timer)
    (5, 2),   -- order 4: pizza only, 16 minutes old (red timer)
    (7, 2);   -- order 5: mixed, one item NOT sent yet
