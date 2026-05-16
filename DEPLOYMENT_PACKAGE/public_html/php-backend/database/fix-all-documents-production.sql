-- Fix ALL documents in production database
-- This script updates all documents with correct links and status
-- Run this on Hostinger database to fix the documents

-- First, check current state:
-- SELECT COUNT(*) FROM documents;
-- SELECT id, category, sno, information, link, status FROM documents ORDER BY category, CAST(sno AS UNSIGNED);

-- Option 1: DELETE ALL and recreate (if documents are a complete mess)
-- Uncomment these lines if you want to start fresh:
/*
DELETE FROM documents;
*/

-- Insert/Update all documents with correct information
-- Uses INSERT ... ON DUPLICATE KEY UPDATE to handle existing records

-- DOCUMENTS Category (B - Documents and Information)
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-1', 'documents', '1', NULL, 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', '#', 'Not Applicable')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-2', 'documents', '2', NULL, 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', '/documents/trustdeed.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-3', 'documents', '3', NULL, 'Registration Certificate', '/documents/Registration Certificate.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-4', 'documents', '4', NULL, 'NOC', '/documents/NOC.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-5', 'documents', '5', NULL, 'RTE', '/documents/RTE.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-6', 'documents', '6', NULL, 'Self Certification Proforma', '/documents/Self Certification proforma.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-7', 'documents', '7', NULL, 'PTA', '/documents/PTA.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-8', 'documents', '8', NULL, 'SMC List', '/documents/SMC_List.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

-- ACADEMIC Category (C - Result and Academics)
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-1', 'academic', '1', NULL, 'Result of Class IX (2023-24)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-2', 'academic', '2', NULL, 'Result of Class X (2023-24)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-3', 'academic', '3', NULL, 'Result of Class XI (2023-24)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-4', 'academic', '4', NULL, 'Result of Class XII (2023-24)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

-- INFRASTRUCTURE Category (E - School Infrastructure / F - Infrastructure Documents)
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-1', 'infrastructure', '1', NULL, 'No. and size of the class rooms (in sq mtr)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-2', 'infrastructure', '2', NULL, 'No. and size of laboratories including computer labs (in sq mtr)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-3', 'infrastructure', '3', NULL, 'No. and size of other rooms (in sq mtr)', '#', 'Not Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-4', 'infrastructure', '4', NULL, 'Drinking Water Sanitation certificate', '/documents/Drinking water Sanitation certificate.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-5', 'infrastructure', '5', NULL, 'Water testing report', '/documents/Water testing report.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-6', 'infrastructure', '6', NULL, 'Building Safety certificate', '/documents/Building safty certificate.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-7', 'infrastructure', '7', NULL, 'Fire certificate', '/documents/fire.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-8', 'infrastructure', '8', NULL, 'INFRASTRUCTURE DETAILS DOCUMENT', '/documents/INFRASTRUCTURE.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

-- Additional documents (if needed)
-- Fees Structure
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-9', 'documents', '9', NULL, 'Fees structure', '/documents/Fees structure.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

-- Calendar
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-5', 'academic', '5', NULL, 'School Calendar', '/documents/Calander.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

-- Land certificate
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-9', 'infrastructure', '9', NULL, 'Land certificate', '/documents/land.pdf', '✓ Available')
ON DUPLICATE KEY UPDATE `information` = VALUES(`information`), `link` = VALUES(`link`), `status` = VALUES(`status`);

-- Verify after running:
-- SELECT COUNT(*) FROM documents;
-- SELECT id, category, sno, information, link, status FROM documents WHERE link != '#' AND link != 'Not Available' ORDER BY category, CAST(sno AS UNSIGNED);
