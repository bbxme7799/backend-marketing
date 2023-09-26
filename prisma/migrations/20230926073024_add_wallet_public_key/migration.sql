/*
  Warnings:

  - Added the required column `wallet_public_key` to the `request_to_withdraw` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `request_to_withdraw` ADD COLUMN `wallet_public_key` VARCHAR(191) NOT NULL;
