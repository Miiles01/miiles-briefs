-- Base de Datos MySQL para Miiles Studio Briefs
-- HostGator cPanel / phpMyAdmin

CREATE TABLE IF NOT EXISTS `brief_submissions` (
  `id` VARCHAR(32) NOT NULL PRIMARY KEY,
  `brief_id` VARCHAR(64) NOT NULL,
  `brief_title` VARCHAR(255) NOT NULL,
  `client_name` VARCHAR(255) NOT NULL,
  `client_email` VARCHAR(255) NOT NULL,
  `client_company` VARCHAR(255) DEFAULT '',
  `client_phone` VARCHAR(64) DEFAULT '',
  `estimated_budget` VARCHAR(128) DEFAULT 'A definir',
  `status` ENUM('new', 'reviewing', 'approved', 'declined', 'archived') DEFAULT 'new',
  `notes` TEXT DEFAULT NULL,
  `answers_json` LONGTEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_brief_id` (`brief_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
