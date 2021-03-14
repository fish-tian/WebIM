CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;

DROP TABLE IF EXISTS `single_member`;
CREATE TABLE `single_member` (
  `uid1` int NOT NULL,
  `uid2` int NOT NULL,
  `sid` int NOT NULL,
  `unread_cnt` int NOT NULL,
  PRIMARY KEY (`uid1`, `uid2`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from `single_member` where uid1 >= 0 and uid2 >= 0;
-- INSERT INTO `message` VALUES (1, 1, 3);
-- INSERT INTO `message` VALUES (2, 1, 4);
-- INSERT INTO `message` VALUES (3, 2, 3);
COMMIT;

select * from single_member;