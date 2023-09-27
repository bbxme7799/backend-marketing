/*
  Warnings:

  - You are about to drop the column `amount` on the `topup` table. All the data in the column will be lost.
  - Added the required column `tx_hash` to the `topup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `topup` DROP COLUMN `amount`,
    ADD COLUMN `tx_hash` VARCHAR(255) NOT NULL;
