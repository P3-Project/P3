CREATE TABLE order_item (
order_item_id SERIAL PRIMARY KEY,
order_id INTEGER NOT NULL,
item_id INTEGER NOT NULL,
quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity>0),
notex TEXT,
sent_at TIMESTAMPTZ,
completed BOOLEAN NOT NULL DEFAULT FALSE,
);
CREATE INDEX idx_order_item_order_id ON order_item(order_id);