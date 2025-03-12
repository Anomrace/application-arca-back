-- AlterTable
ALTER TABLE `Eleve` ADD COLUMN `role` ENUM('student', 'parent', 'admin') NOT NULL DEFAULT 'student';
