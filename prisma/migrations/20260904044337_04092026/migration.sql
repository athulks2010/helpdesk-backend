/*
  Warnings:

  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to drop the column `body` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `photo_path` on the `contacts` table. All the data in the column will be lost.
  - You are about to alter the column `first_name` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(25)`.
  - You are about to alter the column `last_name` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(25)`.
  - You are about to alter the column `phone` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `city` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to drop the column `subject` on the `conversations` table. All the data in the column will be lost.
  - You are about to alter the column `ticket_id` on the `conversations` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `contact_id` on the `conversations` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `created_by` on the `conversations` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to drop the column `answer` on the `faqs` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `faqs` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `faqs` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `front_pages` table. All the data in the column will be lost.
  - You are about to drop the column `meta` on the `front_pages` table. All the data in the column will be lost.
  - You are about to alter the column `slug` on the `front_pages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `title` on the `front_pages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(150)`.
  - You are about to drop the column `content` on the `knowledge_base` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `knowledge_base` table. All the data in the column will be lost.
  - You are about to drop the column `mime` on the `message_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `message_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `message_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `message_attachments` table. All the data in the column will be lost.
  - You are about to alter the column `user_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `contact_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to drop the column `name` on the `navigation_menus` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `navigation_menus` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `navigation_menus` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `organizations` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `phone` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `city` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - The primary key for the `participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `participants` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `user_id` on the `participants` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `contact_id` on the `participants` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to drop the column `content` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `cover` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `posts` table. All the data in the column will be lost.
  - You are about to alter the column `access` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to drop the column `content` on the `services` table. All the data in the column will be lost.
  - You are about to alter the column `image` on the `services` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(250)`.
  - You are about to drop the column `body` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `closed_at` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `first_response_at` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `impact` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `resolve_by` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `urgency` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `tickets` table. All the data in the column will be lost.
  - You are about to alter the column `created_by` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `VarChar(50)`.
  - A unique constraint covering the columns `[slug]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `contacts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `knowledge_base` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `file_path` to the `message_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `message_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `message_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `message_attachments` table without a default value. This is not possible if the table is not empty.
  - Made the column `message_id` on table `message_attachments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_read` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `label` to the `navigation_menus` table without a default value. This is not possible if the table is not empty.
  - Made the column `conversation_id` on table `participants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `details` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Made the column `subject` on table `tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `created_at`,
    DROP COLUMN `slug`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `color` VARCHAR(20) NULL,
    MODIFY `name` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `comments` DROP COLUMN `body`,
    ADD COLUMN `details` TEXT NULL;

-- AlterTable
ALTER TABLE `contacts` DROP COLUMN `country_id`,
    DROP COLUMN `photo_path`,
    ADD COLUMN `country` VARCHAR(2) NULL,
    ADD COLUMN `postal_code` VARCHAR(25) NULL,
    ADD COLUMN `region` VARCHAR(50) NULL,
    MODIFY `first_name` VARCHAR(25) NULL,
    MODIFY `last_name` VARCHAR(25) NULL,
    MODIFY `email` VARCHAR(50) NOT NULL,
    MODIFY `phone` VARCHAR(50) NULL,
    MODIFY `city` VARCHAR(50) NULL,
    MODIFY `address` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `conversations` DROP COLUMN `subject`,
    ADD COLUMN `context` JSON NULL,
    ADD COLUMN `department` VARCHAR(50) NOT NULL DEFAULT 'general',
    ADD COLUMN `last_activity` DATETIME(0) NULL,
    ADD COLUMN `last_message_at` DATETIME(0) NULL,
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `priority` VARCHAR(20) NOT NULL DEFAULT 'medium',
    ADD COLUMN `slug` VARCHAR(100) NULL,
    ADD COLUMN `source` VARCHAR(50) NOT NULL DEFAULT 'website',
    ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    ADD COLUMN `title` VARCHAR(100) NULL,
    ADD COLUMN `type` VARCHAR(20) NOT NULL DEFAULT 'internal',
    MODIFY `ticket_id` INTEGER UNSIGNED NULL,
    MODIFY `contact_id` INTEGER UNSIGNED NULL,
    MODIFY `created_by` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `faqs` DROP COLUMN `answer`,
    DROP COLUMN `order`,
    DROP COLUMN `question`,
    ADD COLUMN `details` TEXT NULL,
    ADD COLUMN `name` VARCHAR(150) NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `front_pages` DROP COLUMN `content`,
    DROP COLUMN `meta`,
    ADD COLUMN `html` JSON NULL,
    MODIFY `slug` VARCHAR(50) NULL,
    MODIFY `title` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `knowledge_base` DROP COLUMN `content`,
    DROP COLUMN `slug`,
    ADD COLUMN `details` TEXT NULL,
    MODIFY `title` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `message_attachments` DROP COLUMN `mime`,
    DROP COLUMN `name`,
    DROP COLUMN `path`,
    DROP COLUMN `size`,
    ADD COLUMN `file_path` VARCHAR(255) NOT NULL,
    ADD COLUMN `file_size` BIGINT NOT NULL,
    ADD COLUMN `filename` VARCHAR(255) NOT NULL,
    ADD COLUMN `mime_type` VARCHAR(255) NOT NULL,
    MODIFY `message_id` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `guid` INTEGER NULL,
    ADD COLUMN `is_internal` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `message_type` VARCHAR(20) NOT NULL DEFAULT 'text',
    ADD COLUMN `read_at` DATETIME(0) NULL,
    MODIFY `conversation_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NULL,
    MODIFY `contact_id` INTEGER NULL,
    MODIFY `message` TEXT NOT NULL,
    MODIFY `is_read` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `navigation_menus` DROP COLUMN `name`,
    DROP COLUMN `order`,
    DROP COLUMN `parent_id`,
    ADD COLUMN `active_key` VARCHAR(255) NULL,
    ADD COLUMN `feature_slug` VARCHAR(255) NULL,
    ADD COLUMN `icon` VARCHAR(255) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `label` VARCHAR(255) NOT NULL,
    ADD COLUMN `location` VARCHAR(32) NOT NULL DEFAULT 'header',
    ADD COLUMN `route_name` VARCHAR(255) NULL,
    ADD COLUMN `route_params` JSON NULL,
    ADD COLUMN `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `target` VARCHAR(16) NOT NULL DEFAULT '_self';

-- AlterTable
ALTER TABLE `notes` DROP COLUMN `content`,
    DROP COLUMN `title`,
    ADD COLUMN `color` VARCHAR(255) NULL,
    ADD COLUMN `details` TEXT NULL,
    ADD COLUMN `name` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `organizations` DROP COLUMN `country_id`,
    ADD COLUMN `country` VARCHAR(2) NULL,
    ADD COLUMN `postal_code` VARCHAR(25) NULL,
    ADD COLUMN `region` VARCHAR(50) NULL,
    MODIFY `name` VARCHAR(100) NULL,
    MODIFY `email` VARCHAR(50) NULL,
    MODIFY `phone` VARCHAR(50) NULL,
    MODIFY `city` VARCHAR(50) NULL,
    MODIFY `address` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `participants` DROP PRIMARY KEY,
    ADD COLUMN `joined_at` DATETIME(0) NULL,
    ADD COLUMN `role` VARCHAR(255) NOT NULL DEFAULT 'participant',
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `conversation_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NULL,
    MODIFY `contact_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `content`,
    DROP COLUMN `cover`,
    DROP COLUMN `slug`,
    ADD COLUMN `details` TEXT NULL,
    ADD COLUMN `image` VARCHAR(250) NULL,
    ADD COLUMN `is_active` INTEGER NOT NULL DEFAULT 1,
    MODIFY `title` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `access` JSON NULL;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `content`,
    ADD COLUMN `details` TEXT NULL,
    ADD COLUMN `icon` VARCHAR(80) NULL,
    ADD COLUMN `is_active` INTEGER NOT NULL DEFAULT 1,
    MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `slug` VARCHAR(255) NOT NULL,
    MODIFY `image` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `body`,
    DROP COLUMN `closed_at`,
    DROP COLUMN `first_response_at`,
    DROP COLUMN `impact`,
    DROP COLUMN `resolve_by`,
    DROP COLUMN `urgency`,
    DROP COLUMN `uuid`,
    ADD COLUMN `close` DATETIME(0) NULL,
    ADD COLUMN `details` TEXT NOT NULL,
    ADD COLUMN `due` DATETIME(0) NULL,
    ADD COLUMN `impact_level` VARCHAR(20) NULL,
    ADD COLUMN `open` DATETIME(0) NULL,
    ADD COLUMN `response` DATETIME(0) NULL,
    ADD COLUMN `uid` VARCHAR(100) NULL,
    ADD COLUMN `urgency_level` VARCHAR(20) NULL,
    MODIFY `subject` VARCHAR(250) NOT NULL,
    MODIFY `created_by` VARCHAR(50) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `services_slug_key` ON `services`(`slug`);
