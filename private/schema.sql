SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `category` VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `date` datetime NOT NULL,
  `description` TINYTEXT NOT NULL,
  `cost` DECIMAL(10,2) NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

SET FOREIGN_KEY_CHECKS=1;
