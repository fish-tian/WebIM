CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `group_member`;
CREATE TABLE `group_member` (
  `uid` int NOT NULL,
  `sid` int NOT NULL,
  `unread_cnt` int NOT NULL,
  PRIMARY KEY (`uid`, `sid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `group_member` where sid >= 0 and uid >= 0;
-- INSERT INTO `message` VALUES (1, 1, 3);
-- INSERT INTO `message` VALUES (2, 1, 4);
-- INSERT INTO `message` VALUES (3, 2, 3);
COMMIT;

select * from group_member;