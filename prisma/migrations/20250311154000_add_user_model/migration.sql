/*
  Warnings:

  - You are about to drop the column `email` on the `Eleve` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Eleve` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Eleve` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Eleve` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Professeur` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Professeur` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Professeur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Eleve` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Professeur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Eleve` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Professeur` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Eleve_email_key` ON `Eleve`;

-- DropIndex
DROP INDEX `Professeur_email_key` ON `Professeur`;

-- AlterTable
ALTER TABLE `Eleve` DROP COLUMN `email`,
    DROP COLUMN `nom`,
    DROP COLUMN `prenom`,
    DROP COLUMN `role`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Professeur` DROP COLUMN `email`,
    DROP COLUMN `nom`,
    DROP COLUMN `prenom`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `role` ENUM('student', 'parent', 'professor', 'admin') NOT NULL DEFAULT 'student',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Eleve_userId_key` ON `Eleve`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Professeur_userId_key` ON `Professeur`(`userId`);

-- AddForeignKey
ALTER TABLE `Eleve` ADD CONSTRAINT `Eleve_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professeur` ADD CONSTRAINT `Professeur_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
