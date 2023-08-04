/*
  Warnings:

  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product` table. All the data in the column will be lost.
  - Added the required column `service` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `service` INTEGER NOT NULL,
    ADD PRIMARY KEY (`service`);
