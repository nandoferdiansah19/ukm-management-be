/*
  Warnings:

  - You are about to drop the column `event_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `instruments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_id,user_id]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `event_id` on table `attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `attendance` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `start_date` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_ibfk_1`;

-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_ibfk_2`;

-- AlterTable
ALTER TABLE `attendance` MODIFY `event_id` CHAR(36) NOT NULL,
    MODIFY `user_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `event_date`,
    ADD COLUMN `end_date` DATE NULL,
    ADD COLUMN `jam_mulai` VARCHAR(16) NULL,
    ADD COLUMN `jam_selesai` VARCHAR(16) NULL,
    ADD COLUMN `start_date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `instrument_loans` MODIFY `status` ENUM('dipinjam', 'dikembalikan', 'tersedia') NULL DEFAULT 'dipinjam';

-- AlterTable
ALTER TABLE `instruments` DROP COLUMN `location`,
    ADD COLUMN `brand` VARCHAR(100) NULL,
    ADD COLUMN `serial_number` VARCHAR(100) NULL,
    ADD COLUMN `type` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `user_skills` ADD COLUMN `penilai` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(255) NOT NULL,
    MODIFY `year` VARCHAR(10) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `attendance_event_id_user_id_key` ON `attendance`(`event_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
