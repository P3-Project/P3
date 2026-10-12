/* Table booking system */
CREATE TABLE reservation (
    reservation_id   SERIAL PRIMARY KEY,
    customer_name    TEXT NOT NULL,
    customer_phone   TEXT,                  /* text ikke numre */
    res_date         DATE NOT NULL,
    res_time         TIME NOT NULL,
    duration         INTEGER NOT NULL DEFAULT 120,  
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    special_request  TEXT,
    status           TEXT NOT NULL DEFAULT 'booked'
        CHECK (status IN ('booked','seated','completed','cancelled','no_show'))
);

/* TEST DATA */
INSERT INTO reservation (customer_name, customer_phone, res_date, res_time, number_of_guests, special_request) VALUES
    ('Jens Jensensen', '98246566', CURRENT_DATE, '18:00', 4, NULL),
    ('Anna Jensen', '12345678', CURRENT_DATE, '19:30', 2, 'Fødselsdag');