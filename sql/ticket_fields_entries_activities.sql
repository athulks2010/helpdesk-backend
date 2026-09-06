-- Custom ticket form builder + per-ticket values + activity timeline
-- Safe to run if Laravel already created these tables.

CREATE TABLE IF NOT EXISTS `ticket_fields` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(50) NOT NULL,
  `label` VARCHAR(255) NULL,
  `name` VARCHAR(100) NULL,
  `placeholder` VARCHAR(255) NULL,
  `options` TEXT NULL,
  `required` TINYINT NOT NULL DEFAULT 0,
  `hint` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_fields_name_index` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ticket_entries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` INT NOT NULL,
  `field_id` INT NULL,
  `name` VARCHAR(100) NOT NULL,
  `label` VARCHAR(255) NULL,
  `value` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_entries_ticket_id_index` (`ticket_id`),
  KEY `ticket_entries_field_id_index` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ticket_activities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` INT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NULL,
  `activity_type` VARCHAR(50) NOT NULL,
  `field_name` VARCHAR(100) NULL,
  `old_value` TEXT NULL,
  `new_value` TEXT NULL,
  `description` TEXT NULL,
  `metadata` JSON NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticket_activities_ticket_id_created_at_index` (`ticket_id`, `created_at`),
  KEY `ticket_activities_activity_type_index` (`activity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
