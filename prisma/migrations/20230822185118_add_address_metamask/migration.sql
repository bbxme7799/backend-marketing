-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `address_for_paid` VARCHAR(255) NULL,
    ADD COLUMN `is_banned` BOOLEAN NOT NULL DEFAULT false;
