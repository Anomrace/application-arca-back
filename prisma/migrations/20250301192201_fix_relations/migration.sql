-- CreateTable
CREATE TABLE `Professeur` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NULL,
    `specialite` VARCHAR(191) NULL,

    UNIQUE INDEX `Professeur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cours` (
    `id` VARCHAR(191) NOT NULL,
    `eleveId` VARCHAR(191) NOT NULL,
    `profId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_eleveId_fkey` FOREIGN KEY (`eleveId`) REFERENCES `Eleve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_profId_fkey` FOREIGN KEY (`profId`) REFERENCES `Professeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
