-- AlterTable
ALTER TABLE `Eleve` ADD COLUMN `profId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Eleve` ADD CONSTRAINT `Eleve_profId_fkey` FOREIGN KEY (`profId`) REFERENCES `Professeur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
