SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `hotels` (
  `hotel_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `star_rating` tinyint DEFAULT 3,
  `description` text,
  `phone` varchar(30) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `lowest_price` decimal(10,2) DEFAULT 0,
  PRIMARY KEY (`hotel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `scenic_spots` (
  `spot_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text,
  `open_time` varchar(50) DEFAULT NULL,
  `close_time` varchar(50) DEFAULT NULL,
  `ticket_price` decimal(10,2) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`spot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(120) NOT NULL,
  `content` text NOT NULL,
  `target_user_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`notification_id`),
  KEY `idx_target_user` (`target_user_id`),
  CONSTRAINT `fk_notifications_target` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `is_frozen` tinyint(1) DEFAULT 0 AFTER `id_issuer`;

SET FOREIGN_KEY_CHECKS = 1;


