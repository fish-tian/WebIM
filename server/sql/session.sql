CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `sid` int NOT NULL AUTO_INCREMENT,
  `group` int NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `session` where sid >= 0;
-- INSERT INTO `message` VALUES (1, 1, 3);
-- INSERT INTO `message` VALUES (2, 1, 4);
-- INSERT INTO `message` VALUES (3, 2, 3);
COMMIT;

select * from session;