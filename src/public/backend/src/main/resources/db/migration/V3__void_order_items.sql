-- A dish removed AFTER it was sent to the kitchen is not deleted (we keep it for the history),
-- it's marked as cancelled. void_acknowledged = the kitchen has seen the notice.
ALTER TABLE order_item
    ADD COLUMN voided_at         TIMESTAMPTZ,
    ADD COLUMN void_acknowledged BOOLEAN NOT NULL DEFAULT FALSE;