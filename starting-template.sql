-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.44-MariaDB-0ubuntu0.18.04.1 - Ubuntu 18.04
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for gaimertest
CREATE DATABASE IF NOT EXISTS `gaimer_basic` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;
USE `gaimer_basic`;

-- Dumping structure for table gaimertest.test
CREATE TABLE IF NOT EXISTS `test` (
  `id` BIGINT NOT NULL AUTO_INCREMENT KEY,
	`token` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gaimertest.test: ~1 rows (approximately)
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` (`token`) VALUES
	('This Is A Test Token Response');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;





CREATE OR REPLACE USER api_user IDENTIFIED BY 'gaimerisawesome';
CREATE OR REPLACE USER api_user@localhost IDENTIFIED BY 'gaimerisawesome';
GRANT SELECT, UPDATE, DELETE, EXECUTE, INSERT ON gaimer_basic.* TO api_user;
GRANT SELECT, UPDATE, DELETE, EXECUTE, INSERT ON gaimer_basic.* TO api_user@localhost;

/* ADDED 24/02/2020 */

CREATE TABLE IF NOT EXISTS `users` ( 
	`user_id` BIGINT NOT NULL AUTO_INCREMENT KEY,
	`user_name` VARCHAR(255) NOT NULL,
	`user_email` VARCHAR(255) NOT NULL,
	`password_hash` VARCHAR(64) NOT NULL,
	`created` DATETIME NULL,
	`modified` DATETIME NULL,
	`deleted` DATETIME NULL);

/* ADDED 28/02/2020 */

CREATE UNIQUE INDEX IF NOT EXISTS idxUsersUserName ON users(user_name);
CREATE UNIQUE INDEX IF NOT EXISTS idxUsersUserEmail ON users(user_email);

ALTER TABLE users MODIFY user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE users MODIFY created DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP(2));

ALTER TABLE users ADD COLUMN `user_avatar_url` VARCHAR(1024) NULL DEFAULT('https://api.adorable.io/avatars/285/abott@adorable.png');

CREATE TABLE IF NOT EXISTS `games` (
	`game_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT KEY,
	`game_name` VARCHAR(255) NOT NULL,
	`game_picture_url`  VARCHAR(1024) NOT NULL
);	

CREATE UNIQUE INDEX IF NOT EXISTS idxGamesGameName ON games(game_name);

CREATE TABLE IF NOT EXISTS `users_games` ( 
	`user_id` BIGINT UNSIGNED NOT NULL,
	`game_id` BIGINT UNSIGNED NOT NULL,
	`user_game_accountname` VARCHAR(255) NOT NULL,
	`created` DATETIME NULL,
	`deleted` DATETIME NULL,
	CONSTRAINT `fk_usersgames_users` FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT,
	CONSTRAINT `fk_usersgames_games` FOREIGN KEY (game_id) REFERENCES games (game_id) ON DELETE CASCADE ON UPDATE RESTRICT
);

INSERT INTO games (`game_name`, `game_picture_url`)
VALUES('DOTA 2', 'http://cdn.dota2.com/apps/dota2/images/nav/logo.png');


ALTER TABLE users_games MODIFY created DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP(2));
ALTER TABLE users_games ADD PRIMARY KEY(user_id, game_id);


CREATE TABLE IF NOT EXISTS `news_items` (
	`item_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT KEY,
	`title` VARCHAR(255) NOT NULL,
	`header_picture_url`  VARCHAR(1024) NULL,
	`content` VARCHAR(10000) NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created` DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP(2)),
	`deleted` DATETIME NULL,
	CONSTRAINT `fk_newsitems_users` FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT
);	

/*13/03/2020*/
ALTER TABLE games ADD COLUMN `bot_api_endpoint` VARCHAR(1024) NOT NULL;
ALTER TABLE games ADD COLUMN `bot_type` ENUM('steam') NOT NULL;
ALTER TABLE games ADD COLUMN `game_modes` VARCHAR(2048) NOT NULL;
/* SET SOME DEFAULT VALUES IF THERE WERE SOME PREVIOUS ONES, SO THE JSON VALIDATION WORKS */
UPDATE games SET bot_api_endpoint = 'https://localhost:3002', game_modes = '{}';
ALTER TABLE games ADD CONSTRAINT valid_game_modes CHECK (JSON_VALID(`game_modes`)) ;

/* 16/03/2020 */
ALTER TABLE `users_games` ADD COLUMN `user_game_accountid` bigint UNSIGNED NULL;
ALTER TABLE `users_games` ADD INDEX `idxUserGameAccountID`(`user_game_accountid`);

CREATE TABLE IF NOT EXISTS `apps` (
	`app_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT KEY,
	`app_name` VARCHAR(255) NOT NULL,
	`app_picture_url`  VARCHAR(1024) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idxAppsAppName ON apps(app_name);

INSERT INTO apps (`app_name`, `app_picture_url`) VALUES('Twitch', 'https://cdn.pixabay.com/photo/2018/05/08/21/29/twitch-3384022_960_720.png');
INSERT INTO apps (`app_name`, `app_picture_url`) VALUES('Steam', 'https://toppng.com/uploads/preview/steam-logo-png-steam-logo-black-11563631869uaboooqq1t.png');

CREATE TABLE IF NOT EXISTS `users_apps` (
	`user_id` BIGINT UNSIGNED NOT NULL,
	`app_id` BIGINT UNSIGNED NOT NULL,
	`user_app_account_name` VARCHAR(255) NOT NULL,
	`access_token` VARCHAR(255),
	`refresh_token` VARCHAR(255),
	`created` DATETIME NULL,
	`deleted` DATETIME NULL,
	CONSTRAINT `fk_usersapps_users` FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE RESTRICT,
	CONSTRAINT `fk_usersapps_apps` FOREIGN KEY(app_id) REFERENCES apps(app_id) ON DELETE CASCADE ON UPDATE RESTRICT
);

ALTER TABLE `users_apps` ADD COLUMN `user_app_account_id` BIGINT UNSIGNED NULL;
ALTER TABLE `users_apps` ADD INDEX `idxUserAppAcountID`(`user_app_account_id`);

ALTER TABLE `users_apps` ADD COLUMN `user_app_account_logo` VARCHAR(1024);

/* 5/04/2020 - ADD A USER FOR THE STEAM BOT! */
INSERT INTO `users` (`user_id`,`user_name`,	`user_email`,	`password_hash`) VALUES(42069, 'Steam Bot', 'gaimerbot@gmail.com', '$2b$12$7VJsftOnAqOhV9q8LmOhquvKxxnWDKLhI8yX3P4gQA6061SzEQO4O');


/* 13/04/2020 - ADD A RESET TOKEN TABLE */

CREATE TABLE IF NOT EXISTS `reset_tokens` ( 
	`token_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT KEY,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`token` VARCHAR(255) NOT NULL,
	`user_email` VARCHAR(255) NOT NULL,
	`created` DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP(2)),
	CONSTRAINT `fk_resettokens_users` FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT);

ALTER TABLE `reset_tokens` ADD INDEX `idxResetTokensToken`(`token`);
ALTER TABLE `reset_tokens` ADD INDEX `idxResetTokensUserEmail`(`user_email`);
