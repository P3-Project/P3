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

INSERT INTO reservation (customer_name, customer_phone, res_date, res_time, number_of_guests, special_request) VALUES
    ('Jens Jensen', '98246566', CURRENT_DATE, '18:00', 4, NULL),          -- reservation 1
    ('Anna Jensen', '12345678', CURRENT_DATE, '19:30', 2, 'Fødselsdag');  -- reservation 2

INSERT INTO reservation_table (reservation_id, table_number) VALUES
    (1, 6),   -- Jens: table 6 (4 seats)
    (2, 10);  -- Anna: table 10 (2 seats)


-- ---------- Orders (one open order per table, like the OrderService requires) ----------

INSERT INTO customer_order (table_number, staff_id) VALUES
    (1, 2),   -- order 1: grill only
    (3, 2),   -- order 2: mixed pizza + grill
    (4, 2),   -- order 3: grill, 12 minutes old (yellow timer)
    (5, 2),   -- order 4: pizza only, 16 minutes old (red timer)
    (7, 2);   -- order 5: mixed, one item NOT sent yet
