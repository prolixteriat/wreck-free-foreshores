CREATE DATABASE IF NOT EXISTS WrecksDB;

USE WrecksDB;

DROP TABLE IF EXISTS `photos`;
DROP TABLE IF EXISTS `environmental`;
DROP TABLE IF EXISTS `safety`;
DROP TABLE IF EXISTS `wrecks`;
DROP TABLE IF EXISTS `password_reset`;
DROP TABLE IF EXISTS `audit`;
DROP TABLE IF EXISTS `users`;
DROP PROCEDURE IF EXISTS clean_password_reset;

-- Tables
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,                -- hash
		`role` VARCHAR(10) NOT NULL DEFAULT 'user',      -- 'admin', 'user'
		`terms_accepted` BOOLEAN NOT NULL DEFAULT FALSE, -- true if user has accepted T&Cs
		`verified` BOOLEAN NOT NULL DEFAULT FALSE,       -- true if email account verified
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
		`disabled` BOOLEAN NOT NULL DEFAULT FALSE,       -- true if account disabled 
		`lock_count` INT NOT NULL DEFAULT 0,             -- no. of failed logins since last successful login (not implemented)
		`locked_at` DATETIME                             -- time at which account was locked due to excessive failed logins (not implemented)
);

CREATE TABLE `password_reset` (
		`email` VARCHAR(255) NOT NULL,
		`token` VARCHAR(255) NOT NULL,                   -- hash
		`expiry` DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 2 HOUR)
);

CREATE TABLE `audit` (
    `audit_id` INT AUTO_INCREMENT PRIMARY KEY,
    `operation` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `wrecks` (
    `wreck_id` INT AUTO_INCREMENT PRIMARY KEY,
    `location` VARCHAR(255) NOT NULL,
		`w3w` VARCHAR(100),
		`latitude` DOUBLE PRECISION NOT NULL,
		`longitude` DOUBLE PRECISION NOT NULL,
		
		`name` VARCHAR(255),
		`make` VARCHAR(255),
		`length` FLOAT NOT NULL,                           -- feet
		`sort` VARCHAR(255) NOT NULL,
		`hull` VARCHAR(255) NOT NULL,
		`engine` VARCHAR(255) NOT NULL,
		
		`position` VARCHAR(100) NOT NULL,
		`floating` VARCHAR(50) NOT NULL,
		`vessel_condition` VARCHAR(255) NOT NULL,
		
		`additional` VARCHAR(1024),
		
    `reported_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
		`reporter_id` INT NOT NULL,
		`owner_id` INT,
		`hidden` BOOLEAN NOT NULL DEFAULT FALSE,          -- true if excluded from all reporting
		`notified` BOOLEAN NOT NULL DEFAULT FALSE,        -- true if communicated to authorities
		`status` VARCHAR(50) NOT NULL DEFAULT 'Reported', -- remediation status
		`comment` VARCHAR(1024),                          -- remediation comments
    `updated_at` DATETIME,                            -- date of last update
		
		FOREIGN KEY (`reporter_id`) REFERENCES `users`(`user_id`),
		FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`)
);

CREATE TABLE `environmental` (
    `environmental_id` INT AUTO_INCREMENT PRIMARY KEY,
    `wreck_id` INT NOT NULL,
    `hazard` VARCHAR(255) NOT NULL,
		
		FOREIGN KEY (`wreck_id`) REFERENCES `wrecks`(`wreck_id`)
);

CREATE TABLE `safety` (
    `safety_id` INT AUTO_INCREMENT PRIMARY KEY,
    `wreck_id` INT NOT NULL,
    `hazard` VARCHAR(255) NOT NULL,
		
		FOREIGN KEY (`wreck_id`) REFERENCES `wrecks`(`wreck_id`)		
);

CREATE TABLE `photos` (
    `photo_id` INT AUTO_INCREMENT PRIMARY KEY,
    `wreck_id` INT NOT NULL,
    `photo` LONGBLOB NOT NULL,
		`height` INT NOT NULL,
		`width` INT NOT NULL,
		
    FOREIGN KEY (`wreck_id`) REFERENCES `wrecks`(`wreck_id`)
);
