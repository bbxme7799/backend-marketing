/*
  Warnings:

  - You are about to drop the column `created_at` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `product` table. All the data in the column will be lost.
  - Added the required column `step` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `step` INTEGER NOT NULL;
