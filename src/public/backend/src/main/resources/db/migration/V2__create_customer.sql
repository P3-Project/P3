CREATE TABLE customer(
customer_id SERIAL PRIMARY KEY,
customer_name VARCHAR(100) NOT NULL,
customer_phone VARCHAR(20) NOT NULL UNIQUE

);