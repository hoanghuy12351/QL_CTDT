-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ql_chuong_trinh_dao_tao_2
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--

--

--

--

--

--
-- Dumping data for table `bo_mon`
--

LOCK TABLES `bo_mon` WRITE;
/*!40000 ALTER TABLE `bo_mon` DISABLE KEYS */;
INSERT INTO `bo_mon` VALUES (2,1,'KHMT','Khoa học máy tính','2026-04-28 15:54:27'),(3,1,'HTTT','Hệ thống thông tin','2026-04-28 15:54:44'),(4,1,'CNTT','Công nghệ thông tin','2026-04-28 15:55:15'),(5,1,'CNPM','Công nghệ phần mềm','2026-04-28 15:55:35');
/*!40000 ALTER TABLE `bo_mon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `chuong_trinh_dao_tao`
--

LOCK TABLES `chuong_trinh_dao_tao` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_dao_tao` DISABLE KEYS */;
INSERT INTO `chuong_trinh_dao_tao` VALUES (1,'CTDT-CNTT-K20','Chương trình đào tạo 12522W4',5,NULL,6,2,150.0,'Đại học','Chính quy','dang_ap_dung',NULL,'2026-05-06 05:07:29','2026-05-06 05:07:29',8),(3,'CTDT-CNTT-K20s','Chương trình đào tạo 12522W4',3,5,6,1,150.0,'Đại học','Chính quy','du_thao',NULL,'2026-05-25 07:03:24','2026-05-25 07:03:24',8),(4,'CTDT-10122G1-K20-DHDPT','Chương trình đào tạo lớp 10122G.1 - Đồ họa Đa phương tiện',5,4,4,2,162.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_10122G.1.xlsx','2026-05-27 12:18:01','2026-05-27 12:18:01',8),(5,'CTDT-10122N1-K20-MMTVTT','Chương trình đào tạo lớp 10122N.1 - Mạng máy tính & Truyền thông',5,4,3,2,162.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_10122N.1(1).xlsx','2026-05-27 12:18:04','2026-05-27 12:18:04',8),(6,'CTDT-10122O1-K20-PTUDIOT','Chương trình đào tạo lớp 10122O.1 - Phát triển ứng dụng IoT',5,4,12,2,162.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_10122O.1.xlsx','2026-05-27 12:18:08','2026-05-27 12:18:08',8),(7,'CTDT-124221-K20-TTNTVKHDL','Chương trình đào tạo lớp 124221 - Trí tuệ nhân tạo và khoa học dữ liệu',2,2,10,2,150.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_124221.xlsx','2026-05-27 12:18:14','2026-05-27 12:18:14',8),(8,'CTDT-12422TN-K20-TTNTVKHDL','Chương trình đào tạo lớp 12422TN - Trí tuệ nhân tạo và khoa học dữ liệu',2,2,10,2,155.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_12422TN.xlsx','2026-05-27 12:18:18','2026-05-27 12:18:18',8),(9,'CTDT-12522T1-K20-KTVDBCLPM','Chương trình đào tạo lớp 12522T.1 - Kiểm thử và Đảm bảo chất lượng phần mềm',3,5,5,2,162.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_12522T.1.xlsx','2026-05-27 12:18:21','2026-05-27 12:18:21',8),(10,'CTDT-12522W1-K20-CNW','Chương trình đào tạo lớp 12522W.1 - Công nghệ Web',3,5,7,2,162.0,'Đại học','Chính quy','dang_ap_dung','Nhập từ file ChuongTrinhDaoTao_12522W.1.xlsx','2026-05-27 12:18:26','2026-05-27 12:18:26',8);
/*!40000 ALTER TABLE `chuong_trinh_dao_tao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `chuong_trinh_hoc_phan`
--

LOCK TABLES `chuong_trinh_hoc_phan` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_hoc_phan` DISABLE KEYS */;
INSERT INTO `chuong_trinh_hoc_phan` VALUES (1,1,1,1,1,0,NULL,NULL),(4,1,2,7,1,1,NULL,NULL),(5,3,2,6,1,0,NULL,NULL),(6,3,1,5,1,0,NULL,NULL),(7,4,130,0,1,1,NULL,NULL),(8,4,131,1,1,2,NULL,NULL),(9,4,132,1,1,3,NULL,NULL),(10,4,133,1,1,4,NULL,NULL),(11,4,134,1,1,5,NULL,NULL),(12,4,135,1,1,6,NULL,NULL),(13,4,136,1,1,7,NULL,NULL),(14,4,137,1,1,8,NULL,NULL),(15,4,99,1,1,9,NULL,NULL),(16,4,138,1,1,10,NULL,NULL),(17,4,57,1,1,11,NULL,NULL),(18,4,139,1,1,12,NULL,NULL),(19,4,140,2,1,13,NULL,NULL),(20,4,141,2,1,14,NULL,NULL),(21,4,142,2,1,15,NULL,NULL),(22,4,143,2,1,16,NULL,NULL),(23,4,144,2,1,17,NULL,NULL),(24,4,25,2,1,18,NULL,NULL),(25,4,56,2,1,19,NULL,NULL),(26,4,86,2,1,20,NULL,NULL),(27,4,145,3,1,21,NULL,NULL),(28,4,30,3,1,22,NULL,NULL),(29,4,84,3,1,23,NULL,NULL),(30,4,7,3,1,24,NULL,NULL),(31,4,40,3,1,25,NULL,NULL),(32,4,77,3,1,26,NULL,NULL),(33,4,47,3,1,27,NULL,NULL),(34,4,146,3,1,28,NULL,NULL),(35,4,147,4,1,29,NULL,NULL),(36,4,148,4,1,30,NULL,NULL),(37,4,149,4,1,31,NULL,NULL),(38,4,150,4,1,32,NULL,NULL),(39,4,151,4,1,33,NULL,NULL),(40,4,18,4,1,34,NULL,NULL),(41,4,13,4,1,35,NULL,NULL),(42,4,152,4,1,36,NULL,NULL),(43,4,153,5,1,37,NULL,NULL),(44,4,154,5,1,38,NULL,NULL),(45,4,155,5,1,39,NULL,NULL),(46,4,110,5,1,40,NULL,NULL),(47,4,31,5,1,41,NULL,NULL),(48,4,156,5,1,42,NULL,NULL),(49,4,157,5,1,43,NULL,NULL),(50,4,5,5,1,44,NULL,NULL),(51,4,6,5,1,45,NULL,NULL),(52,4,43,5,1,46,NULL,NULL),(53,4,158,6,1,47,NULL,NULL),(54,4,159,6,1,48,NULL,NULL),(55,4,111,6,1,49,NULL,NULL),(56,4,160,6,1,50,NULL,NULL),(57,4,161,6,1,51,NULL,NULL),(58,4,162,6,1,52,NULL,NULL),(59,4,50,6,1,53,NULL,NULL),(60,4,10,6,1,54,NULL,NULL),(61,4,163,7,1,55,NULL,NULL),(62,4,41,7,1,56,NULL,NULL),(63,4,45,7,1,57,NULL,NULL),(64,4,164,7,1,58,NULL,NULL),(65,4,79,7,1,59,NULL,NULL),(66,4,17,8,1,60,NULL,NULL),(67,4,78,8,1,61,NULL,NULL),(68,4,80,8,1,62,NULL,NULL),(69,4,48,8,1,63,NULL,NULL),(70,4,165,8,1,64,NULL,NULL),(71,5,132,0,1,1,NULL,NULL),(72,5,130,0,1,2,NULL,NULL),(73,5,131,1,1,3,NULL,NULL),(74,5,133,1,1,4,NULL,NULL),(75,5,134,1,1,5,NULL,NULL),(76,5,135,1,1,6,NULL,NULL),(77,5,136,1,1,7,NULL,NULL),(78,5,137,1,1,8,NULL,NULL),(79,5,99,1,1,9,NULL,NULL),(80,5,138,1,1,10,NULL,NULL),(81,5,57,1,1,11,NULL,NULL),(82,5,139,1,1,12,NULL,NULL),(83,5,140,2,1,13,NULL,NULL),(84,5,141,2,1,14,NULL,NULL),(85,5,142,2,1,15,NULL,NULL),(86,5,143,2,1,18,NULL,NULL),(87,5,144,2,1,19,NULL,NULL),(88,5,25,2,1,20,NULL,NULL),(89,5,56,2,1,21,NULL,NULL),(90,5,86,2,1,22,NULL,NULL),(91,5,145,3,1,23,NULL,NULL),(92,5,30,3,1,24,NULL,NULL),(93,5,84,3,1,25,NULL,NULL),(94,5,20,3,1,26,NULL,NULL),(95,5,40,3,1,28,NULL,NULL),(96,5,77,3,1,29,NULL,NULL),(97,5,146,3,1,30,NULL,NULL),(98,5,147,4,1,31,NULL,NULL),(99,5,148,4,1,32,NULL,NULL),(100,5,12,4,1,35,NULL,NULL),(101,5,68,4,1,36,NULL,NULL),(102,5,13,4,1,37,NULL,NULL),(103,5,44,4,1,38,NULL,NULL),(104,5,21,4,1,39,NULL,NULL),(105,5,152,4,1,40,NULL,NULL),(106,5,153,5,1,41,NULL,NULL),(107,5,154,5,1,42,NULL,NULL),(108,5,155,5,1,43,NULL,NULL),(109,5,110,5,1,44,NULL,NULL),(110,5,156,5,1,45,NULL,NULL),(111,5,3,5,1,46,NULL,NULL),(112,5,24,5,1,49,NULL,NULL),(113,5,158,6,1,50,NULL,NULL),(114,5,159,6,1,51,NULL,NULL),(115,5,111,6,1,52,NULL,NULL),(116,5,160,6,1,53,NULL,NULL),(117,5,161,6,1,54,NULL,NULL),(118,5,113,6,1,55,NULL,NULL),(119,5,162,6,1,56,NULL,NULL),(120,5,4,6,1,57,NULL,NULL),(121,5,36,6,1,58,NULL,NULL),(122,5,163,7,1,59,NULL,NULL),(123,5,8,7,1,60,NULL,NULL),(124,5,55,7,1,61,NULL,NULL),(125,5,164,7,1,62,NULL,NULL),(126,5,79,7,1,63,NULL,NULL),(127,5,17,8,1,64,NULL,NULL),(128,5,78,8,1,65,NULL,NULL),(129,5,80,8,1,66,NULL,NULL),(130,5,48,8,1,67,NULL,NULL),(131,5,165,8,1,68,NULL,NULL),(134,6,132,0,1,1,NULL,NULL),(135,6,130,0,1,2,NULL,NULL),(136,6,131,1,1,3,NULL,NULL),(137,6,133,1,1,4,NULL,NULL),(138,6,134,1,1,5,NULL,NULL),(139,6,135,1,1,6,NULL,NULL),(140,6,136,1,1,7,NULL,NULL),(141,6,137,1,1,8,NULL,NULL),(142,6,99,1,1,9,NULL,NULL),(143,6,138,1,1,10,NULL,NULL),(144,6,57,1,1,11,NULL,NULL),(145,6,139,1,1,12,NULL,NULL),(146,6,140,2,1,13,NULL,NULL),(147,6,141,2,1,14,NULL,NULL),(148,6,142,2,1,15,NULL,NULL),(149,6,143,2,1,16,NULL,NULL),(150,6,144,2,1,17,NULL,NULL),(151,6,25,2,1,18,NULL,NULL),(152,6,56,2,1,19,NULL,NULL),(153,6,86,2,1,20,NULL,NULL),(154,6,145,3,1,21,NULL,NULL),(155,6,30,3,1,22,NULL,NULL),(156,6,84,3,1,23,NULL,NULL),(157,6,20,3,1,24,NULL,NULL),(158,6,11,3,1,25,NULL,NULL),(159,6,68,3,1,26,NULL,NULL),(160,6,77,3,1,27,NULL,NULL),(161,6,146,3,1,28,NULL,NULL),(162,6,147,4,1,29,NULL,NULL),(163,6,148,4,1,30,NULL,NULL),(164,6,12,4,1,31,NULL,NULL),(165,6,62,4,1,32,NULL,NULL),(166,6,13,4,1,33,NULL,NULL),(167,6,26,4,1,34,NULL,NULL),(168,6,28,4,1,35,NULL,NULL),(169,6,152,4,1,36,NULL,NULL),(170,6,153,5,1,37,NULL,NULL),(171,6,154,5,1,38,NULL,NULL),(172,6,155,5,1,39,NULL,NULL),(173,6,110,5,1,40,NULL,NULL),(174,6,156,5,1,41,NULL,NULL),(175,6,29,5,1,42,NULL,NULL),(176,6,22,5,1,43,NULL,NULL),(177,6,157,5,1,44,NULL,NULL),(178,6,3,5,1,45,NULL,NULL),(179,6,158,6,1,46,NULL,NULL),(180,6,159,6,1,47,NULL,NULL),(181,6,111,6,1,48,NULL,NULL),(182,6,160,6,1,49,NULL,NULL),(183,6,161,6,1,50,NULL,NULL),(184,6,113,6,1,51,NULL,NULL),(185,6,162,6,1,52,NULL,NULL),(186,6,69,6,1,53,NULL,NULL),(187,6,52,6,1,54,NULL,NULL),(188,6,163,7,1,55,NULL,NULL),(189,6,42,7,1,56,NULL,NULL),(190,6,92,7,1,57,NULL,NULL),(191,6,164,7,1,58,NULL,NULL),(192,6,79,7,1,59,NULL,NULL),(193,6,17,8,1,60,NULL,NULL),(194,6,78,8,1,61,NULL,NULL),(195,6,80,8,1,62,NULL,NULL),(196,6,48,8,1,63,NULL,NULL),(197,6,165,8,1,64,NULL,NULL),(261,7,132,0,1,1,NULL,NULL),(262,7,130,0,1,2,NULL,NULL),(263,7,131,1,1,3,NULL,NULL),(264,7,133,1,1,4,NULL,NULL),(265,7,134,1,1,5,NULL,NULL),(266,7,135,1,1,6,NULL,NULL),(267,7,136,1,1,7,NULL,NULL),(268,7,99,1,1,8,NULL,NULL),(269,7,138,1,1,10,NULL,NULL),(270,7,137,1,1,11,NULL,NULL),(271,7,57,1,1,12,NULL,NULL),(272,7,139,1,1,13,NULL,NULL),(273,7,140,2,1,15,NULL,NULL),(274,7,141,2,1,16,NULL,NULL),(275,7,142,2,1,17,NULL,NULL),(276,7,143,2,1,18,NULL,NULL),(277,7,144,2,1,19,NULL,NULL),(278,7,25,2,1,20,NULL,NULL),(279,7,56,2,1,21,NULL,NULL),(280,7,86,2,1,22,NULL,NULL),(281,7,145,3,1,23,NULL,NULL),(282,7,147,3,1,24,NULL,NULL),(283,7,163,3,1,25,NULL,NULL),(284,7,62,3,1,26,NULL,NULL),(285,7,84,3,1,27,NULL,NULL),(286,7,20,3,1,28,NULL,NULL),(287,7,68,3,1,29,NULL,NULL),(288,7,70,3,1,30,NULL,NULL),(289,7,146,3,1,31,NULL,NULL),(290,7,148,4,1,32,NULL,NULL),(291,7,153,4,1,33,NULL,NULL),(292,7,154,4,1,34,NULL,NULL),(293,7,113,4,1,35,NULL,NULL),(294,7,59,4,1,36,NULL,NULL),(295,7,100,4,1,37,NULL,NULL),(296,7,77,4,1,38,NULL,NULL),(297,7,35,4,1,39,NULL,NULL),(298,7,159,5,1,40,NULL,NULL),(299,7,12,5,1,41,NULL,NULL),(300,7,156,5,1,42,NULL,NULL),(301,7,114,5,1,43,NULL,NULL),(302,7,103,5,1,44,NULL,NULL),(303,7,92,5,1,45,NULL,NULL),(304,7,152,5,1,46,NULL,NULL),(305,7,155,6,1,47,NULL,NULL),(306,7,158,6,1,48,NULL,NULL),(307,7,160,6,1,49,NULL,NULL),(308,7,110,6,1,50,NULL,NULL),(309,7,30,6,1,51,NULL,NULL),(310,7,60,6,1,52,NULL,NULL),(311,7,104,6,1,54,NULL,NULL),(312,7,111,7,1,55,NULL,NULL),(313,7,161,7,1,56,NULL,NULL),(314,7,93,7,1,57,NULL,NULL),(315,7,116,7,1,58,NULL,NULL),(316,7,108,7,1,59,NULL,NULL),(317,7,79,7,1,61,NULL,NULL),(318,7,165,8,1,62,NULL,NULL),(324,8,132,0,1,1,NULL,NULL),(325,8,130,0,1,3,NULL,NULL),(326,8,131,1,1,4,NULL,NULL),(327,8,133,1,1,5,NULL,NULL),(328,8,134,1,1,6,NULL,NULL),(329,8,135,1,1,7,NULL,NULL),(330,8,136,1,1,8,NULL,NULL),(331,8,99,1,1,9,NULL,NULL),(332,8,138,1,1,11,NULL,NULL),(333,8,137,1,1,12,NULL,NULL),(334,8,57,1,1,13,NULL,NULL),(335,8,139,1,1,14,NULL,NULL),(336,8,140,2,1,16,NULL,NULL),(337,8,141,2,1,17,NULL,NULL),(338,8,142,2,1,18,NULL,NULL),(339,8,143,2,1,19,NULL,NULL),(340,8,144,2,1,20,NULL,NULL),(341,8,25,2,1,21,NULL,NULL),(342,8,56,2,1,22,NULL,NULL),(343,8,86,2,1,23,NULL,NULL),(344,8,145,3,1,24,NULL,NULL),(345,8,147,3,1,25,NULL,NULL),(346,8,163,3,1,26,NULL,NULL),(347,8,62,3,1,27,NULL,NULL),(348,8,84,3,1,28,NULL,NULL),(349,8,20,3,1,29,NULL,NULL),(350,8,68,3,1,30,NULL,NULL),(351,8,70,3,1,31,NULL,NULL),(352,8,146,3,1,32,NULL,NULL),(353,8,148,4,1,33,NULL,NULL),(354,8,153,4,1,34,NULL,NULL),(355,8,154,4,1,35,NULL,NULL),(356,8,113,4,1,36,NULL,NULL),(357,8,59,4,1,37,NULL,NULL),(358,8,100,4,1,38,NULL,NULL),(359,8,77,4,1,39,NULL,NULL),(360,8,35,4,1,40,NULL,NULL),(361,8,159,5,1,41,NULL,NULL),(362,8,110,5,1,42,NULL,NULL),(363,8,12,5,1,43,NULL,NULL),(364,8,106,5,1,44,NULL,NULL),(365,8,156,5,1,45,NULL,NULL),(366,8,114,5,1,46,NULL,NULL),(367,8,103,5,1,47,NULL,NULL),(368,8,92,5,1,48,NULL,NULL),(369,8,152,5,1,49,NULL,NULL),(370,8,155,6,1,50,NULL,NULL),(371,8,158,6,1,51,NULL,NULL),(372,8,160,6,1,52,NULL,NULL),(373,8,161,6,1,53,NULL,NULL),(374,8,30,6,1,54,NULL,NULL),(375,8,60,6,1,55,NULL,NULL),(376,8,104,6,1,57,NULL,NULL),(377,8,111,7,1,58,NULL,NULL),(378,8,93,7,1,59,NULL,NULL),(379,8,116,7,1,60,NULL,NULL),(380,8,74,7,1,61,NULL,NULL),(381,8,108,7,1,62,NULL,NULL),(382,8,79,7,1,64,NULL,NULL),(383,8,165,8,1,65,NULL,NULL),(387,9,132,0,1,1,NULL,NULL),(388,9,130,0,1,2,NULL,NULL),(389,9,131,1,1,3,NULL,NULL),(390,9,133,1,1,4,NULL,NULL),(391,9,134,1,1,5,NULL,NULL),(392,9,135,1,1,6,NULL,NULL),(393,9,136,1,1,7,NULL,NULL),(394,9,137,1,1,8,NULL,NULL),(395,9,99,1,1,9,NULL,NULL),(396,9,138,1,1,10,NULL,NULL),(397,9,57,1,1,11,NULL,NULL),(398,9,139,1,1,12,NULL,NULL),(399,9,140,2,1,13,NULL,NULL),(400,9,141,2,1,14,NULL,NULL),(401,9,142,2,1,15,NULL,NULL),(402,9,143,2,1,16,NULL,NULL),(403,9,144,2,1,17,NULL,NULL),(404,9,25,2,1,18,NULL,NULL),(405,9,56,2,1,19,NULL,NULL),(406,9,86,2,1,20,NULL,NULL),(407,9,145,3,1,21,NULL,NULL),(408,9,160,3,1,22,NULL,NULL),(409,9,62,3,1,23,NULL,NULL),(410,9,84,3,1,24,NULL,NULL),(411,9,20,3,1,25,NULL,NULL),(412,9,68,3,1,26,NULL,NULL),(413,9,70,3,1,27,NULL,NULL),(414,9,146,3,1,28,NULL,NULL),(415,9,147,4,1,29,NULL,NULL),(416,9,148,4,1,30,NULL,NULL),(417,9,153,4,1,31,NULL,NULL),(418,9,30,4,1,32,NULL,NULL),(419,9,59,4,1,33,NULL,NULL),(420,9,77,4,1,34,NULL,NULL),(421,9,13,4,1,35,NULL,NULL),(422,9,63,4,1,36,NULL,NULL),(423,9,159,5,1,37,NULL,NULL),(424,9,156,5,1,38,NULL,NULL),(425,9,72,5,1,39,NULL,NULL),(426,9,113,5,1,40,NULL,NULL),(427,9,69,5,1,42,NULL,NULL),(428,9,61,5,1,43,NULL,NULL),(429,9,152,5,1,44,NULL,NULL),(430,9,154,6,1,45,NULL,NULL),(431,9,155,6,1,46,NULL,NULL),(432,9,158,6,1,47,NULL,NULL),(433,9,161,6,1,48,NULL,NULL),(434,9,110,6,1,49,NULL,NULL),(435,9,12,6,1,50,NULL,NULL),(436,9,15,6,1,51,NULL,NULL),(437,9,65,6,1,52,NULL,NULL),(438,9,71,6,1,53,NULL,NULL),(439,9,163,7,1,54,NULL,NULL),(440,9,111,7,1,55,NULL,NULL),(441,9,64,7,1,56,NULL,NULL),(442,9,47,7,1,57,NULL,NULL),(443,9,16,7,1,58,NULL,NULL),(444,9,79,7,1,59,NULL,NULL),(445,9,17,8,1,60,NULL,NULL),(446,9,78,8,1,61,NULL,NULL),(447,9,80,8,1,62,NULL,NULL),(448,9,48,8,1,63,NULL,NULL),(449,9,165,8,1,64,NULL,NULL),(450,10,132,0,1,1,NULL,NULL),(451,10,130,0,1,2,NULL,NULL),(452,10,131,1,1,3,NULL,NULL),(453,10,134,1,1,4,NULL,NULL),(454,10,142,1,1,5,NULL,NULL),(455,10,99,1,1,6,NULL,NULL),(456,10,57,1,1,7,NULL,NULL),(457,10,139,1,1,8,NULL,NULL),(458,10,140,2,1,10,NULL,NULL),(459,10,141,2,1,11,NULL,NULL),(460,10,135,2,1,12,NULL,NULL),(461,10,143,2,1,13,NULL,NULL),(462,10,144,2,1,14,NULL,NULL),(463,10,25,2,1,15,NULL,NULL),(464,10,56,2,1,16,NULL,NULL),(465,10,86,2,1,18,NULL,NULL),(466,10,145,3,1,19,NULL,NULL),(467,10,160,3,1,20,NULL,NULL),(468,10,62,3,1,21,NULL,NULL),(469,10,84,3,1,22,NULL,NULL),(470,10,20,3,1,23,NULL,NULL),(471,10,68,3,1,24,NULL,NULL),(472,10,70,3,1,25,NULL,NULL),(473,10,146,3,1,26,NULL,NULL),(474,10,147,4,1,27,NULL,NULL),(475,10,148,4,1,28,NULL,NULL),(476,10,153,4,1,29,NULL,NULL),(477,10,30,4,1,30,NULL,NULL),(478,10,59,4,1,31,NULL,NULL),(479,10,77,4,1,32,NULL,NULL),(480,10,63,4,1,33,NULL,NULL),(481,10,14,4,1,34,NULL,NULL),(482,10,159,5,1,35,NULL,NULL),(483,10,156,5,1,36,NULL,NULL),(484,10,72,5,1,37,NULL,NULL),(485,10,113,5,1,38,NULL,NULL),(486,10,69,5,1,40,NULL,NULL),(487,10,74,5,1,41,NULL,NULL),(488,10,152,5,1,42,NULL,NULL),(489,10,154,6,1,43,NULL,NULL),(490,10,155,6,1,44,NULL,NULL),(491,10,158,6,1,45,NULL,NULL),(492,10,161,6,1,46,NULL,NULL),(493,10,110,6,1,47,NULL,NULL),(494,10,12,6,1,48,NULL,NULL),(495,10,15,6,1,49,NULL,NULL),(496,10,60,6,1,50,NULL,NULL),(497,10,71,6,1,51,NULL,NULL),(498,10,163,7,1,52,NULL,NULL),(499,10,111,7,1,53,NULL,NULL),(500,10,75,7,1,54,NULL,NULL),(501,10,92,7,1,55,NULL,NULL),(502,10,16,7,1,56,NULL,NULL),(503,10,79,7,1,57,NULL,NULL),(504,10,17,8,1,58,NULL,NULL),(505,10,78,8,1,59,NULL,NULL),(506,10,80,8,1,60,NULL,NULL),(507,10,48,8,1,61,NULL,NULL),(508,10,165,8,1,62,NULL,NULL);
/*!40000 ALTER TABLE `chuong_trinh_hoc_phan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `chuyen_nganh`
--

LOCK TABLES `chuyen_nganh` WRITE;
/*!40000 ALTER TABLE `chuyen_nganh` DISABLE KEYS */;
INSERT INTO `chuyen_nganh` VALUES (1,4,'TTNTVUD','Trí tuệ nhân tạo và ứng dụng','2026-04-28 17:18:38'),(2,4,'TTNTVHTTT','Trí tuệ nhân tạo và các hệ thống thông minh','2026-04-28 17:19:00'),(3,5,'MMTVTT','Mạng máy tính và Truyền thông','2026-04-28 17:19:24'),(4,5,'DHDPT','Đồ họa đa phương tiện','2026-04-28 17:19:43'),(5,3,'KTVDBCLPM','Kiểm thử và đảm bảo chất lượng phần mềm','2026-04-28 17:20:12'),(6,3,'KTPM','Kỹ thuật phần mềm','2026-04-28 17:21:02'),(7,3,'CNW','Công nghệ web','2026-04-28 17:21:18'),(8,2,'TTNTVNDHA','Trí tuệ nhân tạo và Nhận dạng hình ảnh','2026-04-28 17:21:40'),(9,2,'KHMT','Khoa học máy tính','2026-04-28 17:23:03'),(10,2,'TTNTVKHDL','Trí tuệ nhân tạo và Khoa học dữ liệu','2026-04-28 17:23:36'),(11,3,'CNPM','Công nghệ phần mềm','2026-04-28 18:12:29'),(12,5,'PTUDIOT','Phát triển ứng dụng IoT','2026-04-28 18:26:48');
/*!40000 ALTER TABLE `chuyen_nganh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `co_so`
--

LOCK TABLES `co_so` WRITE;
/*!40000 ALTER TABLE `co_so` DISABLE KEYS */;
INSERT INTO `co_so` VALUES (1,'CS1','Cơ sở Mỹ Hào','phường Mỹ Hào, tỉnh Hưng Yên'),(2,'CS2','Trụ sở chính','xã Việt Tiến, tỉnh Hưng Yên'),(3,'CS3','Cơ sở Hải Dương','Phường Lê Thanh Nghị, Thành phố Hải Phòng');
/*!40000 ALTER TABLE `co_so` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `dinh_muc_giang_vien`
--

LOCK TABLES `dinh_muc_giang_vien` WRITE;
/*!40000 ALTER TABLE `dinh_muc_giang_vien` DISABLE KEYS */;
INSERT INTO `dinh_muc_giang_vien` VALUES (1,1,200.0,0.0,200.0,'Sinh định mức tự động theo chức vụ giảng viên','2026-05-25 20:08:52','2026-05-25 20:08:52',1,'giang_vien_thuong',100.00),(2,1,123.0,0.0,123.0,'Sinh định mức tự động theo chức vụ giảng viên','2026-05-25 20:08:52','2026-05-25 20:08:52',2,'giang_vien_thuong',100.00),(3,1,270.0,54.0,216.0,'Sinh định mức tự động theo chức vụ giảng viên','2026-05-25 20:09:59','2026-05-25 20:09:59',3,'truong_bo_mon',80.00);
/*!40000 ALTER TABLE `dinh_muc_giang_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `giang_vien`
--

LOCK TABLES `giang_vien` WRITE;
/*!40000 ALTER TABLE `giang_vien` DISABLE KEYS */;
INSERT INTO `giang_vien` VALUES (1,2,3,'GV01','Nguyễn Văn Hậu','nguyenvanhau@gmail.com','0123456789','Tiến sĩ','Giảng viên chính','giang_vien',200.0,'dang_giang_day','2026-05-06 05:12:47'),(2,NULL,2,'1227','Nguyễn Văn Hậu','nvhau66@gmail.com','0943651135','PGS.TS','Trưởng Khoa','truong_khoa',123.0,'dang_giang_day','2026-05-12 20:24:26'),(3,NULL,5,'eda','1123123','nguyddenvanhau@gmail.com','123312','123123',NULL,'truong_bo_mon',216.0,'dang_giang_day','2026-05-25 13:09:56'),(4,NULL,2,'1215','Phạm Minh Chuẩn','chuanpm@gmail.com','0983081120','TS','Phó trưởng khoa','truong_khoa',270.0,'dang_giang_day','2026-05-27 12:17:58'),(5,NULL,3,'1226','Nguyễn Đình Chiến','chienql@gmail.com','0962836394','TS','TBM - HTTT','truong_bo_mon',270.0,'dang_giang_day','2026-05-27 12:17:58'),(6,NULL,5,'1218','Nguyễn Văn Quyết','quyetict@gmail.com','0912188636','TS','TBM - CNPM','truong_bo_mon',270.0,'dang_giang_day','2026-05-27 12:17:58'),(7,NULL,3,'1225','Nguyễn Duy Tân','tanndhyvn@gmail.com','0972947808','TS','PTBM - HTTT','truong_bo_mon',270.0,'dang_giang_day','2026-05-27 12:17:58'),(8,NULL,2,'1248','Nguyễn Minh Tiến','minhtienhy@gmail.com','0983860318','PGS.TS','PTBM-KHMT','truong_bo_mon',270.0,'dang_giang_day','2026-05-27 12:17:58'),(9,NULL,NULL,'1217','Vũ Khánh Quý','quyvk0705@gmail.com','0945528686','PGS.TS','GĐ - Aptech','khac',270.0,'dang_giang_day','2026-05-27 12:17:58'),(10,NULL,5,'1229','Đào Anh Hiển','hienda@gmail.com','0983264436','TS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(11,NULL,5,'1236','Hoàng Quốc Việt','viethqict@gmail.com','0976124669','TS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(12,NULL,3,'1224','Chu Bá Thành','thanhcb.dce@gmail.com','0901582882','TS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(13,NULL,2,'1245','Lê Trung Hiếu','hieult.ktmt@gmail.com','0987779776','TS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(14,NULL,5,'1221','Nguyễn Hữu Đông','dongcntt77@gmail.com','0983539745','ThS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(15,NULL,5,'1222','Ngô Thanh Huyền','nthuyenster@gmail.com','0982713518','ThS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(16,NULL,5,'1223','Trịnh Thị Nhị','nhittcntt@gmail.com','0978606526','ThS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(17,NULL,5,'1231','Trần Thị Phương','phuongutehy2405@gmail.com','0975822600','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(18,NULL,5,'1232','Vũ Xuân Thắng','xuanthangutehy@gmail.com','0988169829','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(19,NULL,5,'1242','Trần Đỗ Thu Hà','tdhapi@gmail.com','0976289988','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(20,NULL,5,'1246','Đỗ Thị Thu Trang','tranglexus@gmail.com','0912100248','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(21,NULL,5,'1011','Bùi Đức Thọ','buithok3@gmail.com','868639969','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(22,NULL,3,'1216','Nguyễn Vinh Quy','vinhquynguyen@gmail.com','0912206765','ThS','Quản lý CSVC','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(23,NULL,3,'1228','Phạm Quốc Hùng','quochungvnu@gmail.com','0983360925','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(24,NULL,3,'1394','Ngô Thị Lan Anh','ntlananh.utehy@gmail.com','0972479668','ThS','Phó BT LCĐ','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(25,NULL,3,'1683','Trần Thanh Tùng','tungnhunghy@gmail.com','0984112299','ThS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(26,NULL,3,'1243','Vi Hoài Nam','vihoainam@gmail.com','0944879789','ThS','NCS, CT. Công đoàn','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(27,NULL,5,'1235','Nguyễn Hoàng Điệp','Diep82003@gmail.com','0987862348','ThS','NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(28,NULL,3,'1240','Nguyễn Thị Thanh Huệ','huentt1509@gmail.com','0979851509','ThS','Bí thư LCĐ, NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(29,NULL,3,'1617','Đào Mạnh Linh','daomanhlink@gmail.com','0948869911','ThS','50% giảng dạy, NCS','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(30,NULL,3,'1693','Vũ Thị Kim Ngân','Vunganart@gmail.com','867779839','ThS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(31,NULL,5,'1721','Đỗ Thị Đào','dothidaotk37@gmail.com','0977819049','ThS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(32,NULL,3,'1704','Phạm Thị Hà Linh','phamthihalinh@gmail.com','0987852638','CN','Trợ giảng','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(33,NULL,3,'1719','KS. Nguyễn Anh Hải','Nguyenanhhaiit@gmail.com','366779935',NULL,'Trợ giảng','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(34,NULL,5,'1720','KS. Bùi Thị Hồng Hạnh','hanh74873@gmail.com','362936458',NULL,'Trợ giảng','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(35,NULL,2,'1641','Nguyễn Thu Hà','nguyenthuha28121994@gmail.com','0962028940','ThS','Giáo vụ','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(36,NULL,2,'1737','KS. Đặng Nhật Minh','dangnhatminh124201@gmail.com','382197341',NULL,'Trợ giảng','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(37,NULL,3,'1736','KS. Nguyễn Thị Ngọc Phượng','ngocphuong15112002@gmail.com','0988003575',NULL,'Trợ giảng','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(38,NULL,2,'1800','Nguyễn Đức Tuấn Anh','tuananh010320@gmail.com','0986703811','ThS','Trợ giảng','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(39,NULL,3,'1742','KS. Lê Ngọc Lành','lanh2211pc@gmail.com','0918306646',NULL,'ĐT, BDCM','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(40,NULL,NULL,'1244','Đào Thu Diệp','dieptk2@gmail.com','0978778129','ThS','Chuyên viên','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(41,NULL,NULL,'1252','Hồ Bạch Tuyết','hobachtuyet169@gmail.com','0979634462','ThS','Chuyên viên','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(42,NULL,NULL,'1250','Đỗ Thị Thu','thudteduhy@gmail.com','389142517','ThS','Chuyên viên','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(43,NULL,NULL,'1706','Nguyễn Thu Hoài','nguyenthuhoai28071998@gmail.com','339388368','ThS','Chuyên viên','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(44,NULL,3,'1689','Đặng Việt Hưng','dangviethung1107@gmail.com','0966348117','ThS','NCS Taiwain','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(45,NULL,2,'1233','Lê Thị Thu Hương','Lehuong7885@gmail.com',NULL,'TS','Đang ở nước ngoài','giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(46,NULL,2,'1241','Vũ Huy Thế','thevh.bn@gmail.com','0978823873','TS',NULL,'giang_vien',270.0,'dang_giang_day','2026-05-27 12:17:58'),(47,NULL,3,'1662','Trịnh Văn Loan','loantv@gmail.com','0903277732','PGS.TS','Thỉnh giảng','khac',270.0,'dang_giang_day','2026-05-27 12:17:58'),(48,NULL,5,'1213','Nguyễn Minh Quý','quyutehy@gmail.com','0912068582','TS','Phó HT','khac',270.0,'dang_giang_day','2026-05-27 12:17:58'),(49,NULL,2,'1234','Đặng Vân Anh','vananh271285@gmail.com','0983702911','TS','Giám đốc TTTS&TT','khac',270.0,'dang_giang_day','2026-05-27 12:17:58');
/*!40000 ALTER TABLE `giang_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `giang_vien_hoc_phan`
--

LOCK TABLES `giang_vien_hoc_phan` WRITE;
/*!40000 ALTER TABLE `giang_vien_hoc_phan` DISABLE KEYS */;
/*!40000 ALTER TABLE `giang_vien_hoc_phan` ENABLE KEYS */;
UNLOCK TABLES;

--

--

--

--
-- Dumping data for table `hoc_ky`
--

LOCK TABLES `hoc_ky` WRITE;
/*!40000 ALTER TABLE `hoc_ky` DISABLE KEYS */;
INSERT INTO `hoc_ky` VALUES (1,'HK1','học kỳ 1','dang_ap_dung',1),(2,'HK2','Học kỳ 2','dang_ap_dung',1);
/*!40000 ALTER TABLE `hoc_ky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `hoc_phan`
--

LOCK TABLES `hoc_phan` WRITE;
/*!40000 ALTER TABLE `hoc_phan` DISABLE KEYS */;
INSERT INTO `hoc_phan` VALUES (1,'211211','An ninh mạng(2+1*)',3.0,30,30,60,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-06 05:09:00','2026-05-06 05:09:00',2,1.00,0.0,0.0),(2,'11','Công nghệ phần mềm(2+1*)',3.0,123,123,123,1.00,'thuc_hanh','123','2026-05-25 06:22:21','2026-05-25 06:22:21',5,1.00,0.0,0.0),(3,'221050','An ninh mạng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(4,'231016','Bảo mật máy tính và mạng',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(5,'221144','Biên tập video (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(6,'221145','Bố cục xa và gần (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',3,1.00,0.0,0.0),(7,'221028','Cơ sở thẩm mỹ (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(8,'221126','Công nghệ mạng không dây (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(9,'221141','Đánh giá hiệu năng mạng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(10,'221064','Thiết kế nhân vật',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',3,1.00,0.0,0.0),(11,'221174','Điện tử cho Công nghệ thông tin (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(12,'221134','Định tuyến và chuyển mạch (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(13,'221052','Đồ án 1',3.0,15,0,15,1.00,'do_an_du_an',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',3,1.00,0.0,0.0),(14,'211121','Đồ án 2',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(15,'211123','Đồ án 3',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(16,'211148','Đồ án 4',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(17,'231006','Đồ án 5',3.0,0,24,24,1.00,'do_an_du_an',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',3,1.00,0.0,0.0),(18,'221051','Đồ họa vector (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(19,'221201','Hệ điều hành',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(20,'221190','Hệ điều hành (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(21,'221055','Hệ điều hành mã nguồn mở (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(22,'221175','Hệ thống nhúng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(23,'221080','Hình họa (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(24,'231046','Kiểm thử xâm nhập hệ thống (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(25,'221104','Kiến trúc máy tính',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(26,'221054','Kỹ thuật số (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(27,'221149','Lập trình điều khiển thiết bị',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(28,'221130','Lập trình vi điều khiển (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(29,'215681','Lập trình Web API (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(30,'231005','Mạng máy tính (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(31,'221057','Nghệ thuật đồ hoạ chữ (1+1*)',2.0,15,30,45,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',3,1.00,0.0,0.0),(32,'221183','Nhập môn Kỹ nguyên số: Khai phá và Ứng dụng AI',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(33,'221062','Phân tích & thiết kế hệ thống',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(34,'221147','Phát triển ứng dụng thương mại điện tử',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(35,'231001','Quản trị mạng máy tính (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(36,'221137','Quản trị mạng nâng cao (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(37,'221076','Thiết kế bản vẽ kỹ thuật (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(38,'221066','Thiết kế dàn trang',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(39,'221206','Thiết kế dàn trang (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(40,'221125','Thiết kế đồ họa cơ bản (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(41,'221142','Thiết kế đồ họa nâng cao (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(42,'221131','Thiết kế hệ thống IoT (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(43,'221060','Thiết kế hình động',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(44,'221053','Thiết kế mạng doanh nghiệp (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(45,'221058','Thiết kế nhận diện thương hiệu (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(46,'221064A','Thiết kế nhân vật',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(47,'211147','Thiết kế UI/UX (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(48,'211152','Thiết kế UI/UX cho ứng dụng web và thiết bị di động (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(49,'221063','Thực hành Điện tử cho CNTT',2.0,0,60,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(50,'221049','Trang trí (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(51,'221185','Trí tuệ nhân tạo Ứng dụng',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(52,'290023','Truyền thông trong IoT (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(53,'221188','Ứng dụng AI trong thiết kế đồ họa (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(54,'221179','Ứng dụng công nghệ thông tin cơ bản',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(55,'221059','Xử lý sự cố và mạng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',3,1.00,0.0,0.0),(56,'211002','Cơ sở kỹ thuật lập trình (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(57,'211214','Công dân số (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',5,1.00,0.0,0.0),(58,'211206','Công nghệ phần mềm',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(59,'211205','Công nghệ phần mềm (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(60,'211126','Công nghệ Web và ứng dụng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(61,'211142','Đảm bảo chất lượng phần mềm (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(62,'211156','Hệ quản trị cơ sở dữ liệu (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(63,'211140','Kiểm thử phần mềm (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(64,'211143','Kiểm thử phần mềm tự động (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(65,'211141','Kiểm thử ứng dụng Web và di động (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(66,'211129','Lập trình đa phương tiện Mobile (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(67,'211153','Lập trình dịch vụ mạng trên Mobile (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(68,'211460','Lập trình hướng đối tượng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(69,'211124','Lập trình Mobile cơ bản (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(70,'231028','Lập trình ứng dụng Windows Form (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(71,'211169','Phân tích nghiệp vụ phần mềm',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(72,'211034','Phân tích thiết kế hướng đối tượng với UML (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(73,'221134A','Phân tích thiết kế thuật toán',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(74,'211125','Phát triển phần mềm hướng dịch vụ (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(75,'211127','Phát triển ứng dụng Mobile đa nền tảng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(76,'211151','Quản lý dự án phần mềm',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(77,'221129','Thiết kế web cơ bản (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(78,'211145','Thiết kế và quản trị Web mã nguồn mở (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',5,1.00,0.0,0.0),(79,'231007','Thực tập doanh nghiệp',12.0,0,0,0,1.00,'thuc_tap',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',5,1.00,0.0,0.0),(80,'221182','AI tạo sinh và ứng dụng',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(81,'290011','An toàn và bảo mật thông tin nâng cao',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(82,'290032','Các hệ cơ sở tri thức',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(83,'290060','Các vấn đề hiện đại của Khoa học máy tính',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(84,'211131','Cấu trúc dữ liệu và giải thuật (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(85,'290047','Cấu trúc dữ liệu và giải thuật nâng cao',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(86,'231027','Cơ sở dữ liệu',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(87,'290005','Cơ sở dữ liệu nâng cao',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(88,'290048','Cơ sở toán cho học máy',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(89,'290012','Công nghệ phần mềm nâng cao',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(90,'211101','Định hướng nghề nghiệp',1.0,15,0,15,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(91,'290034','Học máy',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(92,'221180','Học máy cơ bản',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(93,'211259','Học sâu (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(94,'290051','Học sâu và ứng dụng',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(95,'290041','Khai phá dữ liệu lớn',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(96,'290001','Kiến trúc máy tính điều khiển',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(97,'290053','Kỹ thuật lập trình',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(98,'290046','Lập trình nâng cao với Python',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(99,'211132','Lập trình Python cơ bản (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(100,'215705','Lập trình Python nâng cao (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(101,'290033','Mạng thế hệ mới',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(102,'290061','Mật mã và An toàn dữ liệu',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(103,'221177','Nhập môn khai phá dữ liệu (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(104,'211270','Nhập môn Khoa học dữ liệu (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(105,'290003','Phương pháp luận nghiên cứu khoa học',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(106,'290049','Seminar',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(107,'290063','Thị giác máy tính và ứng dụng',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(108,'231051','Thị giác máy tính và ứng dụng (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(109,'290053A','Thực tập',6.0,0,180,180,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(110,'215685','Tiếng Anh cho CNTT 1',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(111,'215687','Tiếng anh cho CNTT 2',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:18:01',2,1.00,0.0,0.0),(112,'231129','Tiếng Anh cho CNTT 3',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(113,'211011','Toán rời rạc',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(114,'211897','Trí tuệ nhân tạo',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(115,'290039','Xử lý ảnh và video',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(116,'211263','Xử lý dữ liệu lớn (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(117,'290040','Xử lý ngôn ngữ tự nhiên',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(118,'290052','Xử lý ngôn ngữ tự nhiên và ứng dụng',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(119,'290036','Xử lý tiếng nói',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(120,'290004','Xử lý tín hiệu',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:17:56','2026-05-27 12:17:56',2,1.00,0.0,0.0),(130,'922208','BD: Kiểm tra đánh giá thế lực',1.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(131,'921113','Giáo dục thể chất 1',1.0,0,30,30,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(132,'CĐR15001','CĐR: Tiếng Anh bậc 3',1.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(133,'921205','HP4 - Giáo dục Quốc phòng & An ninh',1.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(134,'111125','Đại số tuyến tính',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(135,'131001','Hóa học đại cương (1.5+0.5*)',2.0,23,15,38,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(136,'921203','HP3 - Giáo dục Quốc phòng & An ninh',2.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(137,'921202','HP2- Giáo dục Quốc phòng & An ninh',2.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(138,'921201','HP1- Giáo dục Quốc phòng & An ninh',3.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(139,'921204','Giáo dục quốc phòng và an ninh',5.0,0,0,0,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(140,'921114','Giáo dục thể chất 2',1.0,0,30,30,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(141,'711170','Kỹ năng mềm',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(142,'911602','Pháp luật đại cương',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(143,'911102','Triết học Mác - Lênin',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(144,'111126','Giải tích',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(145,'921115','Giáo dục thể chất 3',1.0,0,30,30,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(146,'151100','Tiếng Anh tăng cường',4.0,60,0,60,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(147,'911203','Kinh tế chính trị Mác - Lênin',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(148,'151139','Tiếng Anh 1',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(149,'221026','Thiết kế dàn trang (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(150,'221036','Thiết kế bản vẽ kỹ thuật (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(151,'221030','Hình họa (2+1*)',3.0,30,30,60,1.00,'thuc_hanh',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(152,'121249','Vật lý kỹ thuật',4.0,60,0,60,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(153,'111010','Xác suất thống kê',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(154,'911302','Chủ nghĩa xã hội khoa học',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(155,'911409','Lịch sử Đảng Cộng Sản Việt Nam',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(156,'151140','Tiếng Anh 2',3.0,45,0,45,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(157,'291002','Đồ án 2',3.0,24,0,24,1.00,'do_an_du_an',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(158,'151141','Tiếng Anh 3',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(159,'911504','Tư tưởng Hồ Chí Minh',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(160,'111209','Giải tích số',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(161,'711106','Tâm lý học kỹ thuật',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(162,'221021','Đồ án 3',3.0,24,0,24,1.00,'do_an_du_an',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(163,'931168','Đại cương về kinh tế và môi trường',2.0,30,0,30,1.00,'dai_hoc_thong_thuong',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(164,'221068','Đồ án 4',4.0,0,24,24,1.00,'do_an_du_an',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0),(165,'231183','Đồ án/Khóa luận tốt nghiệp',12.0,0,0,0,1.00,'do_an_khoa_luan_tot_nghiep',NULL,'2026-05-27 12:18:01','2026-05-27 12:18:01',4,1.00,0.0,0.0);
/*!40000 ALTER TABLE `hoc_phan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ke_hoach_dao_tao`
--

LOCK TABLES `ke_hoach_dao_tao` WRITE;
/*!40000 ALTER TABLE `ke_hoach_dao_tao` DISABLE KEYS */;
INSERT INTO `ke_hoach_dao_tao` VALUES (1,1,1,'KH01','Kế hoạch giáo viên học kỳ 1 năm học 2025-2026','da_duyet',NULL,NULL,NULL,'2026-05-06 05:07:44','2026-05-06 12:07:48'),(5,1,1,'123','Kế hoạch giáo viên học kỳ 1 năm học 2025-2026ss222','du_thao',NULL,NULL,NULL,'2026-05-25 06:19:24','2026-05-25 06:19:24'),(6,1,1,'KH012s','Kế hoạch giáo viên học kỳ 1 năm học 2025-2026','du_thao',NULL,NULL,NULL,'2026-05-25 07:04:23','2026-05-25 07:04:23');
/*!40000 ALTER TABLE `ke_hoach_dao_tao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ke_hoach_hoc_ky`
--

LOCK TABLES `ke_hoach_hoc_ky` WRITE;
/*!40000 ALTER TABLE `ke_hoach_hoc_ky` DISABLE KEYS */;
INSERT INTO `ke_hoach_hoc_ky` VALUES (1,1,1,'Kế hoạch giáo viên học kỳ 1 năm học 2025-2026 - học kỳ','dang_thuc_hien',NULL),(2,5,1,'Ke hoach học kỳ 1 nam hoc 2025-2026','du_thao',NULL),(3,5,2,'Ke hoach Học kỳ 2 nam hoc 2025-2026','du_thao',NULL),(4,6,1,'Ke hoach học kỳ 1 nam hoc 2025-2026','du_thao',NULL),(5,6,2,'Ke hoach Học kỳ 2 nam hoc 2025-2026','du_thao',NULL);
/*!40000 ALTER TABLE `ke_hoach_hoc_ky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ke_hoach_lop_hoc_phan`
--

LOCK TABLES `ke_hoach_lop_hoc_phan` WRITE;
/*!40000 ALTER TABLE `ke_hoach_lop_hoc_phan` DISABLE KEYS */;
INSERT INTO `ke_hoach_lop_hoc_phan` VALUES (1,1,1,1,1,25,1,1,1,'goi_y_tu_ctdt',NULL,'da_len_ke_hoach',NULL,'2026-05-06 05:11:21'),(2,4,2,1,6,40,1,1,2,'goi_y_tu_ctdt',NULL,'da_len_ke_hoach',NULL,'2026-05-25 11:38:34'),(3,4,1,2,4,25,1,1,1,'goi_y_tu_ctdt',NULL,'da_len_ke_hoach',NULL,'2026-05-25 11:38:34');
/*!40000 ALTER TABLE `ke_hoach_lop_hoc_phan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `khoa`
--

LOCK TABLES `khoa` WRITE;
/*!40000 ALTER TABLE `khoa` DISABLE KEYS */;
INSERT INTO `khoa` VALUES (1,'CNTT','Khoa Cong nghe Thong tin','2026-04-27 19:00:21');
/*!40000 ALTER TABLE `khoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `khoa_hoc`
--

LOCK TABLES `khoa_hoc` WRITE;
/*!40000 ALTER TABLE `khoa_hoc` DISABLE KEYS */;
INSERT INTO `khoa_hoc` VALUES (1,'K21','2023-2027',2023,2027),(2,'K20','2022-2026',2022,2026),(3,'K22','2024-2028',2024,2028),(4,'K23','2025-2029',2025,2029);
/*!40000 ALTER TABLE `khoa_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--

--

--

--

--

--

--

--
-- Dumping data for table `lich_day_theo_tuan`
--

LOCK TABLES `lich_day_theo_tuan` WRITE;
/*!40000 ALTER TABLE `lich_day_theo_tuan` DISABLE KEYS */;
INSERT INTO `lich_day_theo_tuan` VALUES (1,1,1,NULL,15.0,NULL,NULL,'2026-05-06 05:13:04'),(2,1,3,NULL,15.0,NULL,NULL,'2026-05-06 05:13:04');
/*!40000 ALTER TABLE `lich_day_theo_tuan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lop`
--

LOCK TABLES `lop` WRITE;
/*!40000 ALTER TABLE `lop` DISABLE KEYS */;
INSERT INTO `lop` VALUES (1,'10122G.1KS','10122G.1KS',2,5,4,2,'ĐHCQ',25,'09/2022','12/2026','dang_hoc',NULL,'2026-04-28 18:51:52'),(2,'12522W.4CN','12522W.4CN',1,3,6,2,'ĐHCQ',40,NULL,NULL,'dang_hoc',NULL,'2026-05-25 07:02:28'),(3,'10122G.1','10122G.1',2,5,4,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:01'),(4,'10122N.1','10122N.1',2,5,3,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:04'),(5,'10122O.1','10122O.1',2,5,12,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:08'),(6,'124221','124221',2,2,10,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:14'),(7,'12422TN','12422TN',2,2,10,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:18'),(8,'12522T.1','12522T.1',2,3,5,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:21'),(9,'12522W.1','12522W.1',2,3,7,2,'ĐHCQ',0,'09/2022','12/2026','dang_hoc',NULL,'2026-05-27 12:18:26');
/*!40000 ALTER TABLE `lop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lop_chuong_trinh`
--

LOCK TABLES `lop_chuong_trinh` WRITE;
/*!40000 ALTER TABLE `lop_chuong_trinh` DISABLE KEYS */;
INSERT INTO `lop_chuong_trinh` VALUES (1,1,1,'2026-05-25','dang_ap_dung',NULL),(2,2,3,'2026-05-25','dang_ap_dung',NULL),(3,3,4,'2026-05-27','dang_ap_dung',NULL),(4,4,5,'2026-05-27','dang_ap_dung',NULL),(5,5,6,'2026-05-27','dang_ap_dung',NULL),(6,6,7,'2026-05-27','dang_ap_dung',NULL),(7,7,8,'2026-05-27','dang_ap_dung',NULL),(8,8,9,'2026-05-27','dang_ap_dung',NULL),(9,9,10,'2026-05-27','dang_ap_dung','Gắn tự động từ file ChuongTrinhDaoTao_12522W.1.xlsx');
/*!40000 ALTER TABLE `lop_chuong_trinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nam_hoc`
--

LOCK TABLES `nam_hoc` WRITE;
/*!40000 ALTER TABLE `nam_hoc` DISABLE KEYS */;
INSERT INTO `nam_hoc` VALUES (1,'2025-2026','2026-04-29','2026-05-20','du_thao','2026-04-28 14:17:16');
/*!40000 ALTER TABLE `nam_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nganh`
--

LOCK TABLES `nganh` WRITE;
/*!40000 ALTER TABLE `nganh` DISABLE KEYS */;
INSERT INTO `nganh` VALUES (2,1,'7480101','Khoa học máy tính','2026-04-28 16:41:52',NULL),(3,1,'7480103','Kỹ thuật phần mềm','2026-04-28 17:11:01',NULL),(4,1,'7480107','Trí tuệ nhân tạo','2026-04-28 17:11:15',NULL),(5,1,'7480201','Công nghệ thông tin','2026-04-28 17:11:54',NULL);
/*!40000 ALTER TABLE `nganh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'test.giaovu@utehy.edu.vn','17ed923c45fadadca3a120c661d1630f:391ca6c82e02c336893236c3262a8db44c93ff4c356b917ead449a16a274fcf7ff40bdb0b3d5922db7e9e08bfe2b14da06117ac43efd7fc54ffc3b304d1d6b19','Test Giao Vu','quan_tri','hoat_dong','2026-04-27 18:59:01','2026-05-06 13:15:03'),(2,'nguyenvanhau@gmail.com','9de5b0b329904a7f79f9ca11f676b2c4:aad223ea395586f529bb83061342e7e648bea9834559d69a4267b4dfc34a020cff29b65f52f7fef176c417b8435719ebaef14f5260e3acb794b15b9f0269e87f','Nguyễn Văn Hậu','giang_vien','hoat_dong','2026-05-06 06:17:38','2026-05-06 06:17:38');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nhom_hoc_phan`
--

LOCK TABLES `nhom_hoc_phan` WRITE;
/*!40000 ALTER TABLE `nhom_hoc_phan` DISABLE KEYS */;
INSERT INTO `nhom_hoc_phan` VALUES (1,1,'LT','Ly thuyet','ly_thuyet',25,30,NULL),(2,1,'TH','Thuc hanh','thuc_hanh',25,30,NULL),(3,3,'LT','Ly thuyet','ly_thuyet',25,123,NULL),(4,3,'TH','Thuc hanh','thuc_hanh',25,123,NULL),(5,2,'LT','Ly thuyet','ly_thuyet',40,30,NULL),(6,2,'TH1','Thuc hanh 1','thuc_hanh',20,30,NULL),(7,2,'TH2','Thuc hanh 2','thuc_hanh',20,30,NULL);
/*!40000 ALTER TABLE `nhom_hoc_phan` ENABLE KEYS */;
UNLOCK TABLES;

--

--
-- Dumping data for table `phan_cong_giang_day`
--

LOCK TABLES `phan_cong_giang_day` WRITE;
/*!40000 ALTER TABLE `phan_cong_giang_day` DISABLE KEYS */;
INSERT INTO `phan_cong_giang_day` VALUES (1,1,1,'chinh',30.0,1.00,40.0,'da_phan_cong',NULL,'2026-05-06 05:12:56',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 19:42:11',0,0,0.0),(2,2,1,'thuc_hanh',30.0,1.00,18.0,'da_phan_cong',NULL,'2026-05-06 06:42:06',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 19:42:11',0,0,0.0),(4,3,2,'tro_giang',123.0,1.00,123.0,'da_phan_cong',NULL,'2026-05-25 11:41:59',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 19:42:11',0,0,0.0),(5,4,2,'thuc_hanh',123.0,1.00,123.0,'da_phan_cong',NULL,'2026-05-25 11:42:59',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 19:42:11',0,0,0.0),(6,5,1,'chinh',30.0,1.00,30.0,'da_phan_cong',NULL,'2026-05-25 11:45:38',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 19:42:11',0,0,0.0),(7,6,2,'thuc_hanh',30.0,1.00,30.0,'da_phan_cong',NULL,'2026-05-25 13:26:12',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 13:26:12',0,0,0.0),(8,3,3,'chinh',123.0,1.00,123.0,'da_phan_cong',NULL,'2026-05-25 14:13:35',NULL,0.00,0.00,1.00,1.00,1.00,NULL,'2026-05-25 14:13:35',0,0,0.0);
/*!40000 ALTER TABLE `phan_cong_giang_day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `phong_hoc`
--

LOCK TABLES `phong_hoc` WRITE;
/*!40000 ALTER TABLE `phong_hoc` DISABLE KEYS */;
INSERT INTO `phong_hoc` VALUES (1,3,'123','123',44,'thuc_hanh');
/*!40000 ALTER TABLE `phong_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--

--

--

--

--

--

--

--

--

--

--
-- Dumping data for table `quy_dinh_he_so_si_so`
--

LOCK TABLES `quy_dinh_he_so_si_so` WRITE;
/*!40000 ALTER TABLE `quy_dinh_he_so_si_so` DISABLE KEYS */;
/*!40000 ALTER TABLE `quy_dinh_he_so_si_so` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quy_dinh_tinh_gio`
--

LOCK TABLES `quy_dinh_tinh_gio` WRITE;
/*!40000 ALTER TABLE `quy_dinh_tinh_gio` DISABLE KEYS */;
/*!40000 ALTER TABLE `quy_dinh_tinh_gio` ENABLE KEYS */;
UNLOCK TABLES;

--

--
-- Dumping data for table `tien_do_hoc_phan_lop`
--

LOCK TABLES `tien_do_hoc_phan_lop` WRITE;
/*!40000 ALTER TABLE `tien_do_hoc_phan_lop` DISABLE KEYS */;
INSERT INTO `tien_do_hoc_phan_lop` VALUES (1,1,1,1,'dang_hoc',NULL,NULL,NULL,NULL),(2,1,4,7,'chua_hoc',NULL,NULL,NULL,NULL),(15,2,6,5,'chua_hoc',NULL,NULL,NULL,NULL),(16,2,5,6,'chua_hoc',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tien_do_hoc_phan_lop` ENABLE KEYS */;
UNLOCK TABLES;

--

--
-- Dumping data for table `tuan_dao_tao`
--

LOCK TABLES `tuan_dao_tao` WRITE;
/*!40000 ALTER TABLE `tuan_dao_tao` DISABLE KEYS */;
INSERT INTO `tuan_dao_tao` VALUES (1,1,1,'Tuan 1','2026-04-28','2026-05-02','hoc',NULL),(2,1,2,'Tuan 2','2026-05-03','2026-05-09','hoc',NULL),(3,1,3,'Tuan 3','2026-05-10','2026-05-16','hoc',NULL),(4,1,4,'Tuan 4','2026-05-17','2026-05-19','hoc',NULL);
/*!40000 ALTER TABLE `tuan_dao_tao` ENABLE KEYS */;
UNLOCK TABLES;

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--

--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 12:28:39
