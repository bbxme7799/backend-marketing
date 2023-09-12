/*
  Warnings:

  - You are about to drop the column `rate` on the `topup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `topup` DROP COLUMN `rate`,
    ADD COLUMN `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.00;
