-- DropForeignKey
ALTER TABLE `borrow_records` DROP FOREIGN KEY `borrow_records_cardId_fkey`;

-- AddForeignKey
ALTER TABLE `borrow_records` ADD CONSTRAINT `borrow_records_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `library_cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
