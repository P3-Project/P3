-- Orders: one order per table visit. Called 'orders' because ORDER is a reserved word in SQL.
-- Needs restaurant_table (V1) and staff (V3), so the staff branch must be merged first.
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL REFERENCES restaurant_table (table_number),
    waiter_id INTEGER REFERENCES staff (staff_id), -- empty until staff log in is added
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP, -- set when the order is archived
    cancelled_at TIMESTAMP
);

-- Used to find the open order of a table
CREATE INDEX idx_orders_table_number ON orders (table_number);
