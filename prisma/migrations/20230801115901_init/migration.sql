-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(150) NOT NULL,
    `google_id` VARCHAR(255) NULL,
    `username` VARCHAR(50) NULL,
    `password` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
