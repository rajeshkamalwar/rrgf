-- RRGF School Database Schema
-- Run this SQL in your Hostinger MySQL database (phpMyAdmin or similar)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `admin_sessions`
--

CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` varchar(64) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE IF NOT EXISTS `documents` (
  `id` varchar(36) NOT NULL,
  `category` enum('documents','academic','infrastructure') NOT NULL,
  `sno` varchar(10) NOT NULL,
  `document` text DEFAULT NULL,
  `information` text DEFAULT NULL,
  `link` varchar(500) NOT NULL DEFAULT '#',
  `status` varchar(50) NOT NULL DEFAULT 'Not Available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `sno` (`sno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admissions`
--

CREATE TABLE IF NOT EXISTS `admissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `class_seeking` varchar(50) NOT NULL,
  `previous_school` varchar(255) NOT NULL,
  `previous_class` varchar(50) NOT NULL,
  `parent_name` varchar(255) NOT NULL,
  `relationship` varchar(50) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `alternate_phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `emergency_contact_name` varchar(255) NOT NULL,
  `emergency_contact_phone` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visit_schedules`
--

CREATE TABLE IF NOT EXISTS `visit_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `preferred_date` date NOT NULL,
  `preferred_time` varchar(50) NOT NULL,
  `number_of_visitors` varchar(10) NOT NULL,
  `purpose` varchar(100) NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_images`
--

CREATE TABLE IF NOT EXISTS `hero_images` (
  `id` varchar(36) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE IF NOT EXISTS `gallery_images` (
  `id` varchar(36) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `category` enum('events','academics','sports','cultural','infrastructure','students') NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_config`
--

CREATE TABLE IF NOT EXISTS `gallery_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `onedrive_folder_link` varchar(500) DEFAULT NULL,
  `onedrive_folder_id` varchar(100) DEFAULT NULL,
  `last_sync` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smtp_config`
--

CREATE TABLE IF NOT EXISTS `smtp_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host` varchar(255) NOT NULL,
  `port` int(11) NOT NULL DEFAULT 587,
  `user` varchar(255) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `from` varchar(255) NOT NULL,
  `to` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Insert default documents data
-- These match the mandatory disclosure requirements
--

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-1', 'documents', '1', NULL, 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', '#', 'Not Applicable'),
('doc-2', 'documents', '2', NULL, 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', '/documents/trustdeed.pdf', '✓ Available'),
('doc-3', 'documents', '3', NULL, 'Registration Certificate', '/documents/Registration Certificate.pdf', '✓ Available'),
('doc-4', 'documents', '4', NULL, 'NOC', '/documents/NOC.pdf', '✓ Available'),
('doc-5', 'documents', '5', NULL, 'RTE', '/documents/RTE.pdf', '✓ Available'),
('doc-6', 'documents', '6', NULL, 'Self Certification Proforma', '/documents/Self Certification proforma.pdf', '✓ Available'),
('doc-7', 'documents', '7', NULL, 'PTA', '/documents/PTA.pdf', '✓ Available'),
('doc-8', 'documents', '8', NULL, 'SMC List', '/documents/SMC_List.pdf', '✓ Available'),
('doc-9', 'documents', '9', NULL, 'Fees structure', '/documents/Fees structure.pdf', '✓ Available'),

('acad-1', 'academic', '1', NULL, 'Result of Class IX (2023-24)', '#', 'Not Available'),
('acad-2', 'academic', '2', NULL, 'Result of Class X (2023-24)', '#', 'Not Available'),
('acad-3', 'academic', '3', NULL, 'Result of Class XI (2023-24)', '#', 'Not Available'),
('acad-4', 'academic', '4', NULL, 'Result of Class XII (2023-24)', '#', 'Not Available'),
('acad-5', 'academic', '5', NULL, 'School Calendar', '/documents/Calander.pdf', '✓ Available'),

('infra-1', 'infrastructure', '1', NULL, 'No. and size of the class rooms (in sq mtr)', '#', 'Not Available'),
('infra-2', 'infrastructure', '2', NULL, 'No. and size of laboratories including computer labs (in sq mtr)', '#', 'Not Available'),
('infra-3', 'infrastructure', '3', NULL, 'No. and size of other rooms (in sq mtr)', '#', 'Not Available'),
('infra-4', 'infrastructure', '4', NULL, 'Drinking Water Sanitation certificate', '/documents/Drinking water Sanitation certificate.pdf', '✓ Available'),
('infra-5', 'infrastructure', '5', NULL, 'Water testing report', '/documents/Water testing report.pdf', '✓ Available'),
('infra-6', 'infrastructure', '6', NULL, 'Building Safety certificate', '/documents/Building safty certificate.pdf', '✓ Available'),
('infra-7', 'infrastructure', '7', NULL, 'Fire certificate', '/documents/fire.pdf', '✓ Available'),
('infra-8', 'infrastructure', '8', NULL, 'INFRASTRUCTURE DETAILS DOCUMENT', '/documents/INFRASTRUCTURE.pdf', '✓ Available'),
('infra-9', 'infrastructure', '9', NULL, 'Land certificate', '/documents/land.pdf', '✓ Available'),
('infra-10', 'infrastructure', '10', NULL, 'Infrastructure layout / site photograph (JPEG)', '/documents/infradoc.jpeg', '✓ Available');