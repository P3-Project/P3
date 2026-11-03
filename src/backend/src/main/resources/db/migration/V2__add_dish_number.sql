-- The number printed on PPSH's menu ("24", "2A", ...). Customers and waiters use it
-- to order quickly. TEXT, not INTEGER, because some numbers have letters (2A, 36A).
-- Nullable: 6 dishes in menu.json don't have a number.
ALTER TABLE menu_item ADD COLUMN dish_number TEXT;
