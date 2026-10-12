CREATE TABLE staff (
    staff_id      INTEGER PRIMARY KEY,
    staff_number  VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    active        BOOLEAN      NOT NULL DEFAULT TRUE
);
