-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: manager
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(9) NOT NULL,
  `station_id` int NOT NULL,
  `score` tinyint DEFAULT NULL,
  `comment_content` text,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `station_id` (`station_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`),
  CONSTRAINT `comments_chk_1` CHECK (((`score` >= 1) and (`score` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` (`comment_id`, `user_id`, `station_id`, `score`, `comment_content`, `timestamp`) VALUES (1,'100000004',5,5,'推荐','2025-05-21 05:02:40'),(2,'100000003',5,4,'一般般','2025-05-14 05:02:40'),(3,'100000004',4,3,'推荐','2025-05-25 05:02:40'),(4,'100000004',4,4,'一般般','2025-06-05 05:02:40'),(5,'100000002',2,5,'客服是丰川祥子, 可爱','2025-06-03 05:02:40'),(6,'100000003',3,3,'服务不错','2025-06-05 05:02:40'),(7,'100000002',1,5,'还行','2025-05-12 05:02:40'),(8,'100000001',5,3,'态度很好','2025-06-07 05:02:40'),(9,'100000001',4,5,'服务不错','2025-05-20 05:02:40'),(10,'100000004',5,4,'一般般','2025-05-17 05:02:40'),(11,'100000000',2,3,'客服是黑化丰川祥子','2025-05-20 05:02:40'),(12,'100000000',5,5,'还行','2025-05-29 05:02:40'),(13,'100000003',4,4,'一般般','2025-06-03 05:02:40'),(14,'100000000',5,4,'推荐','2025-05-09 05:02:40'),(15,'100000004',4,4,'推荐','2025-05-08 05:02:40'),(16,'100000001',3,4,'推荐','2025-05-12 05:02:40'),(17,'100000003',4,5,'还行','2025-05-12 05:02:40'),(18,'100000000',3,4,'很满意','2025-05-12 05:02:40'),(19,'100000003',5,5,'服务不错','2025-05-11 05:02:40'),(20,'100000001',3,3,'服务不错','2025-05-16 05:02:40'),(21,'100000000',3,4,'态度很好','2025-05-15 05:02:40'),(22,'100000001',5,5,'推荐','2025-06-01 05:02:40'),(23,'100000004',1,5,'服务不错','2025-06-02 05:02:40'),(24,'100000003',5,4,'推荐','2025-05-11 05:02:40'),(25,'100000002',5,3,'态度很好','2025-05-21 05:02:40'),(26,'100000001',4,3,'服务不错','2025-05-19 05:02:40'),(27,'100000001',5,5,'很满意','2025-06-07 05:02:40'),(28,'100000000',6,4,'一般般','2025-05-28 05:02:40'),(29,'100000002',1,4,'很满意','2025-05-15 05:02:40'),(30,'100000004',2,3,'还行','2025-05-18 05:02:40');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_station_score` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
    UPDATE stations
    SET score = (
        SELECT AVG(score)
        FROM comments
        WHERE station_id = NEW.station_id
    )
    WHERE station_id = NEW.station_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(9) NOT NULL,
  `station_id` int NOT NULL,
  `favorite_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`station_id`),
  KEY `station_id` (`station_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` (`id`, `user_id`, `station_id`, `favorite_time`) VALUES (16,'100000003',1,'2025-06-07 13:22:28'),(17,'100000001',1,'2025-06-07 13:22:28'),(18,'100000004',1,'2025-06-07 13:22:28'),(19,'100000002',2,'2025-06-07 13:22:28'),(20,'100000001',2,'2025-06-07 13:22:28'),(21,'100000003',2,'2025-06-07 13:22:28'),(22,'100000000',3,'2025-06-07 13:22:28'),(23,'100000002',3,'2025-06-07 13:22:28'),(24,'100000001',3,'2025-06-07 13:22:28'),(25,'100000001',4,'2025-06-07 13:22:28'),(26,'100000003',4,'2025-06-07 13:22:28'),(27,'100000004',4,'2025-06-07 13:22:28'),(28,'100000002',5,'2025-06-07 13:22:28'),(29,'100000001',5,'2025-06-07 13:22:28'),(30,'100000004',5,'2025-06-07 13:22:28');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station_manager`
--

DROP TABLE IF EXISTS `station_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station_manager` (
  `id` char(6) NOT NULL,
  `manager_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `manager_name` (`manager_name`),
  CONSTRAINT `station_manager_chk_1` CHECK (regexp_like(`id`,_utf8mb4'^[0-9]{6}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_manager`
--

LOCK TABLES `station_manager` WRITE;
/*!40000 ALTER TABLE `station_manager` DISABLE KEYS */;
INSERT INTO `station_manager` (`id`, `manager_name`, `password`) VALUES ('200000','admin_0','0'),('200001','admin_1','admin_pwd_1'),('200002','admin_2','admin_pwd_2'),('200003','admin_3','admin_pwd_3'),('200004','admin_4','admin_pwd_4');
/*!40000 ALTER TABLE `station_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `station_id` int NOT NULL AUTO_INCREMENT,
  `manager_id` char(6) NOT NULL,
  `station_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `score` decimal(3,2) DEFAULT NULL,
  `business_hours` varchar(50) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `is_open` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`station_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `station_manager` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` (`station_id`, `manager_id`, `station_name`, `address`, `score`, `business_hours`, `capacity`, `is_open`) VALUES (1,'200000','南山驿站','深圳市南山区科技园',4.67,'08:00-20:00',100,1),(2,'200001','西湖驿站','杭州市西湖区龙井路',3.67,'06:00-17:00',90,0),(3,'200002','中关村驿站','北京市中关村南大街',3.60,'09:00-22:00',100,1),(4,'200003','浦东驿站','上海市浦东新区张江路',4.00,'08:00-20:00',150,1),(5,'200004','鼓楼驿站','南京市鼓楼区中山北路',4.27,'10:00-22:00',200,1),(6,'200000','江汉驿站','武汉市江汉区青年路',4.00,'08:00-20:00',100,1);
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(9) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  CONSTRAINT `users_chk_1` CHECK (regexp_like(`id`,_utf8mb4'^[0-9]{9}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `user_name`, `password`) VALUES ('100000000','user_0','0'),('100000001','user_1','hashed_pwd_1'),('100000002','user_2','hashed_pwd_2'),('100000003','user_3','hashed_pwd_3'),('100000004','user_4','hashed_pwd_4');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'manager'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-07 21:30:52
