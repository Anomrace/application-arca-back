-- DropForeignKey
ALTER TABLE `Cours` DROP FOREIGN KEY `Cours_eleveId_fkey`;

-- DropIndex
DROP INDEX `Cours_eleveId_fkey` ON `Cours`;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_eleveId_fkey` FOREIGN KEY (`eleveId`) REFERENCES `Eleve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
