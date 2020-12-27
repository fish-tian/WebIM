CREATE DATABASE IF NOT EXISTS `webim`;
USE `webim`;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` char(50) NOT NULL,
  `password` char(128) NOT NULL,
  `email` char(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


BEGIN;
delete from user where id >= 0;
INSERT INTO `user` VALUES (1, 'admin', '$2a$10$x3f0Y2SNAmyAfqhKVAV.7uE7RHs3FDGuSYw.LlZhOFoyK7cjfZ.Q6', '66666@qq.com');
INSERT INTO `user` VALUES (2, 'qiuheng', '$2a$10$V.i4fbFSVthOqEMDDwn4veByirOtny5TDcr9DatGAmb3GW56XU2ti', '99999@qq.com');
INSERT INTO `user` VALUES (3, 'hank', '$2a$10$h8DgDcQQc7GPtKMT953X0OjT87NeRvkgBx7OIkNg/ltnjlU7NLrX6', '22222@qq.com');
COMMIT;

select * from user;