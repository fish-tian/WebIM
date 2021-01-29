CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `request`;
CREATE TABLE `request` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `uid1` int NOT NULL,
  `uid2` int NOT NULL,
  `date` timestamp NOT NULL,
  `state` int NOT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

BEGIN;
delete from `request` where rid >= 0;
COMMIT;

select * from request;