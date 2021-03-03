CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `sid` int NOT NULL,
  `uid` int NOT NULL,
  `unread_cnt` int NOT NULL,
  PRIMARY KEY (`sid`, `uid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `member` where sid >= 0;
-- INSERT INTO `message` VALUES (1, 1, 3);
-- INSERT INTO `message` VALUES (2, 1, 4);
-- INSERT INTO `message` VALUES (3, 2, 3);
COMMIT;

select * from member;