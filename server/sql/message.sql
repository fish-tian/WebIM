CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `mid` int NOT NULL AUTO_INCREMENT,
  `sid` int NOT NULL,
  `sender_uid` int NOT NULL,
  `message` varchar(256) NOT NULL,
  `date` timestamp NOT NULL,
  `read` int NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `message` where mid >= 0;
-- INSERT INTO `message` VALUES (1, 1, 3);
-- INSERT INTO `message` VALUES (2, 1, 4);
-- INSERT INTO `message` VALUES (3, 2, 3);
COMMIT;

select * from message;