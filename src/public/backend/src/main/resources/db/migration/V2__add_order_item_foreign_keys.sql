-- order_item.item_id must point to a real dish on the menu
ALTER TABLE order_item
    ADD FOREIGN KEY (item_id) REFERENCES menu_item(item_id);