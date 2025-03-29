-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `publisher` VARCHAR(191) NOT NULL,
    `publishYear` INTEGER NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `total` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `library_cards` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `type` ENUM('student', 'teacher') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `borrow_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookId` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `borrowDate` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `returnDate` DATE NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `status` ENUM('borrowed', 'returned') NOT NULL DEFAULT 'borrowed',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `borrow_records` ADD CONSTRAINT `borrow_records_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow_records` ADD CONSTRAINT `borrow_records_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `library_cards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow_records` ADD CONSTRAINT `borrow_records_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
