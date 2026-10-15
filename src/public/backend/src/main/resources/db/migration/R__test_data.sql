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


-- ---------- Menu ----------

INSERT INTO menu_item (name, price, dish_description, station, out_of_stock, category) VALUES
    -- Pizza kitchen
    ('MARGHERITA',    79,  'med tomatsauce, 2 x ost og oregano',                                'PIZZA', FALSE, 'Pizza'),
    ('PEPPERONI',     85,  'med tomatsauce, ost, pepperoni og oregano',                         'PIZZA', FALSE, 'Pizza'),
    ('HAWAII',        89,  'med tomatsauce, ost, skinke, ananas og oregano',                    'PIZZA', FALSE, 'Pizza'),
    ('VESUVIO',       103, 'med tomatsauce, ost, skinke, pepperoni, cocktailpølser og oregano', 'PIZZA', FALSE, 'Pizza'),
    -- Grill kitchen
    ('PEBERSTEAK',    209, 'af oksefilet med pebersauce og pommes frites',                      'GRILL', FALSE, 'Grill og steak specialiteter'),
    ('DANSK BØF',     119, 'ca. 200g. med pommes sautes, brun sovs og stegte løg',              'GRILL', FALSE, 'Grill og steak specialiteter'),
    ('T-BONE STEAK',  289, 'ca. 400g. med pommes sautes, champignonsauce og bearnaisesauce',    'GRILL', FALSE, 'Grill og steak specialiteter'),
    ('ADANA KEBAB',   129, 'stærk krydret tyrkisk ret med oksefars på spyd',                    'GRILL', FALSE, 'Grill og steak specialiteter'),
    ('DOBBELTBURGER', 80,  'salat, agurk, tomat, rødløg og burgerdressing',                     'GRILL', FALSE, 'Burgere');


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

-- Item ids are looked up by name, so the order of the menu inserts above doesn't matter
INSERT INTO order_item (order_id, item_id, quantity, note, sent_at) VALUES
    -- Order 1 (table 1): grill only, just sent
    (1, (SELECT item_id FROM menu_item WHERE name = 'DANSK BØF'),     2, NULL,           now()),
    (1, (SELECT item_id FROM menu_item WHERE name = 'DOBBELTBURGER'), 1, 'uden løg',     now()),

    -- Order 2 (table 3): pizza AND grill, appears on BOTH kitchen screens
    (2, (SELECT item_id FROM menu_item WHERE name = 'MARGHERITA'),    2, NULL,           now()),
    (2, (SELECT item_id FROM menu_item WHERE name = 'PEBERSTEAK'),    1, 'medium rare',  now()),

    -- Order 3 (table 4): grill, sent 12 minutes ago
    (3, (SELECT item_id FROM menu_item WHERE name = 'T-BONE STEAK'),  1, 'well done',    now()),
    (3, (SELECT item_id FROM menu_item WHERE name = 'ADANA KEBAB'),   2, 'ekstra stærk', now()),

    -- Order 4 (table 5): pizza only, sent 16 minutes ago, NOT on the grill screen
    (4, (SELECT item_id FROM menu_item WHERE name = 'PEPPERONI'),     1, 'uden oregano', now()),

    -- Order 5 (table 7): Hawaii sent; Vesuvio still on the waiter's screen (sent_at NULL)
    (5, (SELECT item_id FROM menu_item WHERE name = 'HAWAII'),        2, 'ekstra ananas', now()),
    (5, (SELECT item_id FROM menu_item WHERE name = 'VESUVIO'),       1, NULL,           NULL);