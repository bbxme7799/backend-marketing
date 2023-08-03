-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `min` INTEGER NOT NULL,
    `max` INTEGER NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `type` VARCHAR(50) NOT NULL,
    `average_delivery` VARCHAR(255) NOT NULL,
    `dripfeed` BOOLEAN NOT NULL,
    `refill` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `USD_rate` (
    `id` INTEGER NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
