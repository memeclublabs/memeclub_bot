-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "tgId" BIGINT NOT NULL,
    "tgUsername" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "profileImg" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "refCode" TEXT NOT NULL,
    "referBy" BIGINT,
    "langCode" TEXT,
    "walletNetwork" TEXT,
    "walletAddress" TEXT,
    "walletBalance" BIGINT,
    "totalPoints" BIGINT NOT NULL DEFAULT 0,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAction" (
    "id" BIGSERIAL NOT NULL,
    "opTgId" BIGINT NOT NULL,
    "opDisplayName" TEXT,
    "actionType" TEXT NOT NULL,
    "selfReward" BIGINT,
    "targetTgId" BIGINT,
    "targetReward" BIGINT,
    "targetDisplayName" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" BIGSERIAL NOT NULL,
    "network" TEXT,
    "address" TEXT NOT NULL,
    "balance" BIGINT,
    "privateKey" TEXT,
    "mnemonic" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletOrder" (
    "id" BIGSERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "walletId" BIGINT NOT NULL,
    "opAmount" BIGINT,
    "opTgId" BIGINT,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" BIGSERIAL NOT NULL,
    "chatId" BIGINT NOT NULL,
    "chatType" TEXT NOT NULL,
    "chatTitle" TEXT NOT NULL,
    "chatUsername" TEXT,
    "chatLangCode" TEXT,
    "memberCount" BIGINT,
    "inviterTgId" BIGINT NOT NULL,
    "botId" BIGINT NOT NULL,
    "botUsername" TEXT NOT NULL,
    "botStatus" TEXT NOT NULL,
    "memecoinId" BIGINT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memecoin" (
    "id" BIGSERIAL NOT NULL,
    "network" TEXT,
    "name" TEXT,
    "ticker" TEXT,
    "description" TEXT,
    "image" TEXT,
    "devTgId" BIGINT,
    "coinStatus" TEXT,
    "contractVersion" TEXT,
    "deployTxHash" TEXT,
    "masterAddress" TEXT,
    "devWalletAddress" TEXT,
    "opWalletAddress" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memecoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyOrder" (
    "id" BIGSERIAL NOT NULL,
    "memecoinId" BIGINT NOT NULL,
    "buyAmt" BIGINT,
    "fromCoin" TEXT,
    "fromAmt" BIGINT,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellOrder" (
    "id" BIGSERIAL NOT NULL,
    "memecoinId" BIGINT NOT NULL,
    "sellAmt" BIGINT,
    "toCoin" TEXT,
    "toAmt" BIGINT,
    "txHash" TEXT,
    "extInfo" TEXT,
    "traceId" TEXT,
    "createBy" BIGINT,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyBy" BIGINT,
    "modifyDt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_tgId_key" ON "User"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "User_refCode_key" ON "User"("refCode");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatId_key" ON "Chat"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_memecoinId_key" ON "Chat"("memecoinId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_memecoinId_fkey" FOREIGN KEY ("memecoinId") REFERENCES "Memecoin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
