-- CreateEnum
CREATE TYPE "WalletMode" AS ENUM ('PlatformCustody', 'UserOwnWallet');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletMode" "WalletMode";
