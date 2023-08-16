/*
  Warnings:

  - You are about to drop the column `user_id` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_user_id_fkey`;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `user_id`,
    MODIFY `service_name` VARCHAR(255) NOT NULL;
