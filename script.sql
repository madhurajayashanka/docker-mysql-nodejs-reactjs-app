-- Create the appdb database
CREATE DATABASE IF NOT EXISTS appdb;

-- Use the appdb database
USE appdb;

-- Create the apptb table
CREATE TABLE `appdb`.`apptb` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));



