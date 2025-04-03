-- DropForeignKey
ALTER TABLE `borrow_records` DROP FOREIGN KEY `borrow_records_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `borrow_records` DROP FOREIGN KEY `borrow_records_bookId_fkey`;

-- AddForeignKey
ALTER TABLE `borrow_records` ADD CONSTRAINT `borrow_records_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow_records` ADD CONSTRAINT `borrow_records_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
