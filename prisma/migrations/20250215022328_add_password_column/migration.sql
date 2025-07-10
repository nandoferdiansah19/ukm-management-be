-- CreateTable
CREATE TABLE `attendance` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `event_id` CHAR(36) NULL,
    `user_id` CHAR(36) NULL,
    `status` ENUM('hadir', 'tidak_hadir') NULL DEFAULT 'hadir',
    `scanned_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `event_id`(`event_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `event_date` DATETIME(0) NOT NULL,
    `location` VARCHAR(255) NULL,
    `created_by` CHAR(36) NULL,

    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instrument_loans` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `instrument_id` CHAR(36) NULL,
    `user_id` CHAR(36) NULL,
    `loan_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `return_date` TIMESTAMP(0) NULL,
    `status` ENUM('dipinjam', 'dikembalikan') NULL DEFAULT 'dipinjam',

    INDEX `instrument_id`(`instrument_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instruments` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(255) NOT NULL,
    `condition` ENUM('baik', 'rusak', 'diperbaiki') NULL DEFAULT 'baik',
    `location` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_skills` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `user_id` CHAR(36) NULL,
    `skill` VARCHAR(100) NULL,
    `rating` INTEGER NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(100) NOT NULL,
    `nim` VARCHAR(20) NOT NULL,
    `program_study` VARCHAR(100) NULL,
    `year` INTEGER NULL,
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `attendance_count` INTEGER NULL DEFAULT 0,
    `division` VARCHAR(100) NULL,
    `role` ENUM('admin', 'pengurus', 'anggota') NULL DEFAULT 'anggota',
    `profile_picture` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nim`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `instrument_loans` ADD CONSTRAINT `instrument_loans_ibfk_1` FOREIGN KEY (`instrument_id`) REFERENCES `instruments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `instrument_loans` ADD CONSTRAINT `instrument_loans_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_skills` ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
