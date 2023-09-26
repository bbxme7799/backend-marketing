/*
  Warnings:

  - Added the required column `status` to the `request_to_withdraw` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `request_to_withdraw` ADD COLUMN `status` ENUM('PENDING', 'APPROVE', 'REJECT') NOT NULL;
