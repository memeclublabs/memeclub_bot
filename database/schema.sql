
DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User
(
    userId TEXT PRIMARY KEY,
    tgId  TEXT,
    tgUsername  TEXT,
    refCode TEXT,
    refTgId TEXT,
    refTgUsername TEXT,
    totalRefPoint INTEGER,
    totalActionPoint INTEGER,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy  TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trc_user_tg_id ON User(tgId);
CREATE INDEX IF NOT EXISTS idx_trc_user_tg_username ON User(tgUsername);
CREATE INDEX IF NOT EXISTS idx_trc_user_ref_code ON User(refCode);
CREATE INDEX IF NOT EXISTS idx_trc_ref_by_tg_id ON User(refTgId);


INSERT INTO User (userId, tgId, tgUsername)
VALUES ('1', '1 Alfreds Futterkiste', 'Maria Anders1'),
       ('2', '2 Around the Horn', 'Thomas Hardy1'),
       ('3', '3 Bs Beverages', 'Victoria Ashworth1'),
       ('4', '4 Bs Beverages', 'Random Name1');




DROP TABLE IF EXISTS Customers;
CREATE TABLE IF NOT EXISTS Customers
(
    CustomerId INTEGER PRIMARY KEY,
    CompanyName TEXT,
    ContactName TEXT
);


INSERT INTO Customers (CustomerID, CompanyName, ContactName)
VALUES (1, 'Alfreds Futterkiste', 'Maria Anders1'),
       (4, 'Around the Horn', 'Thomas Hardy1'),
       (11, 'Bs Beverages', 'Victoria Ashworth1'),
       (13, 'Bs Beverages', 'Random Name1');
