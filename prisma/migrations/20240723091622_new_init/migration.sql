-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "tgId" INTEGER NOT NULL,
    "tgUsername" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "profileImg" TEXT,
    "refCode" TEXT NOT NULL,
    "referBy" TEXT,
    "langCode" TEXT,
    "walletNetwork" TEXT,
    "walletAddress" TEXT,
    "walletBalance" INTEGER,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAction" (
    "id" SERIAL NOT NULL,
    "opTgId" INTEGER NOT NULL,
    "opDisplayName" TEXT,
    "actionType" TEXT NOT NULL,
    "selfReward" INTEGER,
    "targetTgId" INTEGER,
    "targetReward" INTEGER,
    "targetDisplayName" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "network" TEXT,
    "address" TEXT NOT NULL,
    "balance" INTEGER,
    "privateKey" TEXT,
    "mnemonic" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletOrder" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "walletId" INTEGER NOT NULL,
    "opAmount" INTEGER,
    "opTgId" INTEGER,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

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
    "chatLangCode" TEXT,
    "contractVersion" TEXT,
    "deployTxHash" TEXT,
    "masterAddress" TEXT,
    "devWalletAddress" TEXT,
    "opWalletAddress" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memecoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyOrder" (
    "id" SERIAL NOT NULL,
    "memecoinId" INTEGER NOT NULL,
    "buyAmt" INTEGER,
    "fromCoin" TEXT,
    "fromAmt" INTEGER,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellOrder" (
    "id" SERIAL NOT NULL,
    "memecoinId" INTEGER NOT NULL,
    "sellAmt" INTEGER,
    "toCoin" TEXT,
    "toAmt" INTEGER,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" INTEGER,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" INTEGER,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_tgId_key" ON "User"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "User_refCode_key" ON "User"("refCode");

-- CreateIndex
CREATE UNIQUE INDEX "UserAction_opTgId_key" ON "UserAction"("opTgId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");
