-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "tgId" INTEGER,
    "tgUsername" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "profileImg" TEXT,
    "refCode" TEXT,
    "referBy" TEXT,
    "langCode" TEXT,
    "walletNetwork" TEXT,
    "walletAddress" TEXT,
    "walletBalance" INTEGER,
    "totalPoints" INTEGER,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAction" (
    "id" SERIAL NOT NULL,
    "opTgId" INTEGER,
    "opDisplayName" TEXT,
    "actionType" TEXT,
    "selfReward" INTEGER,
    "targetTgId" INTEGER,
    "targetReward" INTEGER,
    "targetDisplayName" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "UserAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "network" TEXT,
    "address" TEXT,
    "balance" INTEGER,
    "privateKey" TEXT,
    "mnemonic" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletOrder" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "walletId" INTEGER,
    "opAmount" INTEGER,
    "opTgId" INTEGER,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "WalletOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memecoin" (
    "id" SERIAL NOT NULL,
    "network" TEXT,
    "name" TEXT,
    "ticker" TEXT,
    "description" TEXT,
    "image" TEXT,
    "devTgId" INTEGER,
    "coinStatus" TEXT,
    "chatId" INTEGER,
    "chatType" TEXT,
    "chatTitle" TEXT,
    "chatUsername" TEXT,
    "chatStatus" TEXT,
    "contractVersion" TEXT,
    "deployTxHash" TEXT,
    "masterAddress" TEXT,
    "devWalletAddress" TEXT,
    "opWalletAddress" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "Memecoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyOrder" (
    "id" SERIAL NOT NULL,
    "memecoinId" INTEGER,
    "buyAmt" INTEGER,
    "fromCoin" TEXT,
    "fromAmt" INTEGER,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "BuyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellOrder" (
    "id" SERIAL NOT NULL,
    "memecoinId" INTEGER,
    "sellAmt" INTEGER,
    "toCoin" TEXT,
    "toAmt" INTEGER,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" INTEGER,
    "modifyBy" INTEGER,
    "modifyDt" INTEGER,

    CONSTRAINT "SellOrder_pkey" PRIMARY KEY ("id")
);
