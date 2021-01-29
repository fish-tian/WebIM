CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `fid` int NOT NULL AUTO_INCREMENT,
  `uid1` int NOT NULL,
  `uid2` int NOT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `friend` where fid >= 0;
INSERT INTO `friend` VALUES (1, 1, 3);
INSERT INTO `friend` VALUES (2, 1, 4);
INSERT INTO `friend` VALUES (3, 2, 3);
COMMIT;

select * from friend;