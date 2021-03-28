CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `sid` int NOT NULL,
  `group_name` varchar(256) NOT NULL,
  `owner_uid` int NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `group` where sid >= 0;
-- INSERT INTO `message` VALUES (1, 1, 3);
-- INSERT INTO `message` VALUES (2, 1, 4);
-- INSERT INTO `message` VALUES (3, 2, 3);
COMMIT;

select * from `group`;