<?php 
$createDbQuery = "CREATE DATABASE `neuroevolutionsimulation`;";
$createTableQuery = "CREATE TABLE `neuroevolutionsimulation`.`trackimage` (`serial` INT NULL AUTO_INCREMENT , `data` MEDIUMBLOB NOT NULL , `date` DATE NULL , `start_pos` POINT NOT NULL , `start_vector` POINT NOT NULL , PRIMARY KEY (`serial`)) ENGINE = InnoDB;";

?>