-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: aliyun    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `event_start_date` date NOT NULL,
  `event_end_date` date NOT NULL,
  `is_violated` tinyint(1) DEFAULT '0',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

INSERT INTO `event` VALUES (1,'Spring Charity Run','fun run','Central Park, New York','2025-03-15','2025-03-15',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--6705930f-611a-4729-95a6-2c289079578b/breastcancer.jpg.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (2,'Summer Fun Run','fun run','Golden Gate Park, San Francisco','2025-06-20','2025-06-20',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--6058a9f9-7ef4-424a-b03b-6bd1fb3286c8/effective-altrusim.jpg.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (3,'Autumn Marathon','fun run','Boston Common, Boston','2025-09-10','2025-09-15',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--6efc783f-e7ef-4841-a490-8f1190cbbfb1/peopleofsudan.png.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (4,'Fall Music Festival','concert','Central Park, New York','2025-10-01','2025-10-05',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--ae0bab21-147d-44b9-ad68-4a8066bc031b/climate-change-fund.jpg.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (5,'Charity Tech Conference','workshop','Convention Center, San Francisco','2025-10-02','2025-10-04',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--97b706a2-b2d3-4d82-97e9-c337dad377e0/homeless_giving.png.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 07:08:18');
INSERT INTO `event` VALUES (6,'Winter Dash','fun run','Millennium Park, Chicago','2025-12-05','2025-12-05',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--495c229f-a2a5-417e-9924-164d250de28c/shutterstock_2185545177.jpg.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (7,'Spring Gala Dinner','gala','Grand Hotel, Los Angeles','2025-04-25','2025-10-26',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--5f73d32e-5e2b-49d7-99ba-e50fb6244f7f/couple-volunteering-at-a-sanctuary-for-pigs-2025-02-10-11-57-03-utc.jpg.webp?width=760&preferwebp=true','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (8,'Summer Charity Ball','gala','Convention Center, Miami','2026-07-15','2026-07-15',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--b39721bf-f8d9-441c-8eec-c58f835d402a/most-highly-rated.jpg.webp?width=760&preferwebp=true','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (9,'Autumn Awards Night','gala','City Hall, Seattle','2025-11-20','2025-11-20',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--ae0bab21-147d-44b9-ad68-4a8066bc031b/climate-change-fund.jpg.webp?width=760&preferwebp=true','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (10,'Winter Charity Gala','gala','Plaza Hotel, Denver','2025-09-20','2026-01-01',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--b50c5bdb-eafd-4ba5-a04d-44e35c49cd10/children_happy.png.webp?width=760&preferwebp=true','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (11,'Art Auction Spring','auction','Art Gallery, Portland','2026-03-30','2026-03-30',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--fc832b1c-7e6a-4c09-bbf4-4cf3df7d6e31/boy_desk.png.webp?width=760&preferwebp=true','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (12,'Charity Auction Summer','auction','Community Center, Austin','2026-06-25','2026-06-25',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--00686527-f693-4253-8440-2f06f78e102b/SupportGroupVeterans.jpg.webp?width=760&preferwebp=true','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (13,'Vintage Car Auction','auction','Fairgrounds, Phoenix','2025-11-15','2025-11-15',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--30a374c6-3a08-48b7-beff-2b3b6af0b111/gettyimages-1224827407-170667a.png.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (14,'Holiday Auction','auction','Town Hall, Philadelphia','2025-12-10','2025-12-10',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--c634519b-f3b7-48b2-b0e1-970920b84a97/popular-charities-png.png.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (15,'Charity Bake Sale','food festival','School Grounds, San Diego','2025-11-12','2025-11-12',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--b9ddde07-b906-4a84-afc4-4d5c92e6425e/shutterstock_2131786157.jpg.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (16,'Food Festival','food festival','Riverside Park, Portland','2026-07-08','2026-07-10',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--bbf2d2c5-2928-4be7-b354-ec941240b188/usaid-logo.jpg.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (17,'Harvest Festival','food festival','Farm Grounds, Nashville','2025-10-25','2025-10-26',0,'https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--f4bfdd5d-77f6-462e-91eb-c1597b635498/Animal-Rescue-Dog-and-Cat.png.webp?preferwebp=true&width=760','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (18,'Jazz Night','concert','Jazz Club, New Orleans','2025-11-30','2025-11-30',0,'https://www.wateraid.org/jp/sites/g/files/jkxoof266/files/styles/wateraid_square_small_medium_2x/public/wateraid-winnovators-event-london-19th-october-2018.webp?h=d5b48c0b&itok=Ur3fULbO','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (19,'Classical Symphony','concert','Opera House, San Francisco','2025-12-05','2025-12-05',0,'https://www.wateraid.org/jp/sites/g/files/jkxoof266/files/styles/wateraid_square_small_medium_2x/public/osaka-marathon-2026-.webp?itok=q_Re6HiX','2025-10-03 06:07:32','2025-10-03 06:08:10');
INSERT INTO `event` VALUES (20,'Charity Workshop','workshop','Community Center, Boston','2025-11-08','2025-11-08',0,'https://www.wateraid.org/jp/sites/g/files/jkxoof266/files/styles/wateraid_square_small_medium_2x/public/_dsc8157.webp?h=fcf25457&itok=Pu83kEDQ','2025-10-03 06:07:32','2025-10-03 06:08:10');

--
-- Table structure for table `event_detail`
--

DROP TABLE IF EXISTS `event_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `description` text,
  `purpose` text,
  `ticket_price` decimal(10,2) DEFAULT '0.00',
  `goal_amount` decimal(15,2) DEFAULT NULL,
  `current_amount` decimal(15,2) DEFAULT '0.00',
  `registration_form` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_detail_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_detail`
--

INSERT INTO `event_detail` VALUES (1,1,'Join us for a 5K run through Central Park to support local education initiatives. All fitness levels welcome!','Raise funds for educational programs in underserved communities',25.00,50000.00,35000.00,'Please fill out emergency contact and medical information','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (2,2,'Fun run through Golden Gate Park with scenic views. Family-friendly event with activities for all ages.','Support environmental conservation projects in the Bay Area',30.00,75000.00,45000.00,'Include shirt size and emergency contact details','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (3,3,'Annual autumn marathon through historic Boston. Multi-day event with different race lengths.','Fund medical research at local hospitals',50.00,100000.00,25000.00,'Previous marathon experience required','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (4,4,'Four-day outdoor music festival featuring multiple genres and local artists. Food vendors and camping available.','Support music education programs in public schools',75.00,150000.00,95000.00,'Camping preferences and dietary restrictions','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (5,5,'Three-day technology conference with workshops, keynotes, and networking. Multiple tracks available.','Bridge the digital divide by providing technology access to underserved communities',150.00,200000.00,125000.00,'Track preferences and dietary needs','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (6,6,'Winter fun run in Millennium Park. Holiday themed with hot chocolate at the finish line.','Provide winter clothing for homeless individuals',20.00,40000.00,5000.00,'Warm clothing size and emergency contact','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (7,7,'Two-day elegant gala dinner with live entertainment and silent auction. Black tie optional.','Support arts education in public schools',150.00,200000.00,150000.00,'Dietary restrictions and table preferences','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (8,8,'Summer ball with dancing, dinner, and live band. Outdoor venue with beautiful city views.','Raise funds for summer youth programs',125.00,180000.00,90000.00,'Dietary needs and accessibility requirements','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (9,9,'Awards night celebrating community heroes. Dinner and recognition ceremony included.','Honor volunteers and raise funds for volunteer programs',100.00,150000.00,30000.00,'Nomination submissions and dietary preferences','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (10,10,'Two-day winter gala with holiday theme. Formal dinner and charity auction included.','Provide holiday meals for families in need',175.00,250000.00,75000.00,'Dietary restrictions and guest information','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (11,11,'Spring art auction featuring local artists. Wine and hors d\'oeuvres served.','Support local artists and art education programs',0.00,30000.00,22000.00,'Bidder registration and contact information','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (12,12,'Summer auction with items from local businesses. BBQ dinner included.','Fund community improvement projects',15.00,45000.00,18000.00,'Registration and payment information','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (13,13,'Vintage car auction for automobile enthusiasts. Preview day available.','Support transportation for disabled individuals',25.00,50000.00,12000.00,'Buyer registration and payment details','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (14,14,'Holiday auction with gift items and experiences. Family-friendly event.','Provide holiday gifts for underprivileged children',0.00,35000.00,8000.00,'Bidder registration and shipping information','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (15,15,'Community bake sale with homemade goods. All proceeds go to local food banks.','Combat food insecurity in our community',0.00,5000.00,3500.00,'Volunteer signup and donation preferences','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (16,16,'Three-day summer food festival featuring local restaurants. Cooking demonstrations included.','Support local restaurants affected by the pandemic',10.00,25000.00,15000.00,'Tasting preferences and dietary restrictions','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (17,17,'Two-day harvest festival celebrating local agriculture. Farm-to-table dinner included.','Promote sustainable farming practices',35.00,40000.00,20000.00,'Dietary needs and group size','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (18,18,'Jazz night at historic venue. Multiple performers throughout the evening.','Preserve jazz heritage and support young musicians',60.00,35000.00,28000.00,'Seating preferences and dietary restrictions','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (19,19,'Classical symphony performance by renowned orchestra. Formal attire suggested.','Maintain symphony orchestra operations',80.00,120000.00,85000.00,'Seating preferences and accessibility needs','2025-10-03 06:07:32','2025-10-03 06:07:32');
INSERT INTO `event_detail` VALUES (20,20,'Three-day technology skills training workshop. Computers provided for participants.','Bridge the digital divide in our community',25.00,30000.00,15000.00,'Experience level and equipment preferences','2025-10-03 06:07:32','2025-10-03 06:07:32');
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-03 21:05:41


-- registrations.sql
CREATE TABLE `registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `ticket_quantity` int NOT NULL DEFAULT 1,
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `registrations` (`event_id`, `full_name`, `email`, `phone`, `ticket_quantity`, `total_amount`) VALUES
(1, 'John Smith', 'john.smith@email.com', '555-0101', 2, 50.00),
(1, 'Sarah Johnson', 'sarah.j@email.com', '555-0102', 1, 25.00),
(1, 'Mike Wilson', 'mike.wilson@email.com', '555-0103', 4, 100.00),
(2, 'Emily Davis', 'emily.davis@email.com', '555-0104', 2, 60.00),
(2, 'David Brown', 'david.brown@email.com', '555-0105', 1, 30.00),
(3, 'Lisa Anderson', 'lisa.anderson@email.com', '555-0106', 3, 150.00),
(4, 'Robert Taylor', 'robert.taylor@email.com', '555-0107', 2, 150.00),
(5, 'Jennifer Lee', 'jennifer.lee@email.com', '555-0108', 1, 150.00),
(6, 'Thomas Clark', 'thomas.clark@email.com', '555-0109', 2, 40.00),
(7, 'Amanda White', 'amanda.white@email.com', '555-0110', 1, 150.00);
