DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    tgId                INTEGER,
    tgUsername          TEXT,
    firstName           TEXT,
    lastName            TEXT,
    profileImg          TEXT,
    refCode             TEXT,
    referBy             TEXT,
    langCode            TEXT,
    walletNetwork       TEXT,
    walletAddress       TEXT,
    walletBalance       INTEGER,
    totalPoints         INTEGER,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trc_user_tg_id ON User(tgId);
CREATE INDEX IF NOT EXISTS idx_trc_user_ref_code ON User(refCode);
CREATE INDEX IF NOT EXISTS idx_trc_ref_by_tg_id ON User(referBy);


INSERT INTO User (tgId, tgUsername, firstName)
VALUES (1, '1 Alfreds Futterkiste', 'Maria Anders1'),
       (2, '2 Around the Horn', 'Thomas Hardy1'),
       (3, '3 Bs Beverages', 'Victoria Ashworth1'),
       (4, '4 Bs Beverages', 'Random Name1');



DROP TABLE IF EXISTS UserAction;
CREATE TABLE IF NOT EXISTS UserAction
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    opTgId            INTEGER,
    opDisplayName     TEXT,
    actionType        TEXT,
    selfReward        INTEGER,
    targetTgId        INTEGER,
    targetReward       INTEGER,
    targetDisplayName    TEXT,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);


DROP TABLE IF EXISTS Wallet;
CREATE TABLE IF NOT EXISTS Wallet
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    network  TEXT,
    address  TEXT,
    balance  INTEGER,
    privateKey  TEXT,
    mnemonic  TEXT,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);


DROP TABLE IF EXISTS WalletOrder;
CREATE TABLE IF NOT EXISTS WalletOrder
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    type             TEXT,
    walletId         INTEGER,
    opAmount         INTEGER,
    opTgId           INTEGER,
    txHash           TEXT,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);

DROP TABLE IF EXISTS Memecoin;
CREATE TABLE IF NOT EXISTS Memecoin
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    network             TEXT,
    name                TEXT,
    ticker              TEXT,
    description         TEXT,
    image               TEXT,
    devTgId             INTEGER,
    coinStatus          TEXT,
    chatId              INTEGER,
    chatType            TEXT,
    chatTitle           TEXT,
    chatUsername        TEXT,
    chatStatus          TEXT,
    contractVersion     TEXT,
    deployTxHash        TEXT,
    masterAddress       TEXT,
    devWalletAddress    TEXT,
    opWalletAddress     TEXT,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);

DROP TABLE IF EXISTS BuyOrder;
CREATE TABLE IF NOT EXISTS BuyOrder
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    memecoinId         INTEGER,
    buyAmt             INTEGER,
    fromCoin           TEXT,
    fromAmt            INTEGER,
    txHash             TEXT,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);


DROP TABLE IF EXISTS SellOrder;
CREATE TABLE IF NOT EXISTS SellOrder
(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    memecoinId           INTEGER,
    sellAmt              INTEGER,
    toCoin               TEXT,
    toAmt                INTEGER,
    txHash              TEXT,
    extInfo             TEXT,
    traceId             TEXT,
    createBy            INTEGER,
    createDt            INTEGER,
    modifyBy            INTEGER,
    modifyDt            INTEGER
);

