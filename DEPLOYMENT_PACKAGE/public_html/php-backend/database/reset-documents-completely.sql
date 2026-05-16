-- COMPLETE RESET of documents table
-- WARNING: This deletes ALL existing documents and recreates them
-- Use this ONLY if documents table is completely messed up
-- Backup your database first!

-- Step 1: Delete all existing documents
DELETE FROM documents;

-- Step 2: Insert all documents with correct information
-- DOCUMENTS Category
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-1', 'documents', '1', NULL, 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', '#', 'Not Applicable'),
('doc-2', 'documents', '2', NULL, 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', '/documents/trustdeed.pdf', '✓ Available'),
('doc-3', 'documents', '3', NULL, 'Registration Certificate', '/documents/Registration Certificate.pdf', '✓ Available'),
('doc-4', 'documents', '4', NULL, 'NOC', '/documents/NOC.pdf', '✓ Available'),
('doc-5', 'documents', '5', NULL, 'RTE', '/documents/RTE.pdf', '✓ Available'),
('doc-6', 'documents', '6', NULL, 'Self Certification Proforma', '/documents/Self Certification proforma.pdf', '✓ Available'),
('doc-7', 'documents', '7', NULL, 'PTA', '/documents/PTA.pdf', '✓ Available'),
('doc-8', 'documents', '8', NULL, 'SMC List', '/documents/SMC_List.pdf', '✓ Available'),
('doc-9', 'documents', '9', NULL, 'Fees structure', '/documents/Fees structure.pdf', '✓ Available');

-- ACADEMIC Category
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-1', 'academic', '1', NULL, 'Result of Class IX (2023-24)', '#', 'Not Available'),
('acad-2', 'academic', '2', NULL, 'Result of Class X (2023-24)', '#', 'Not Available'),
('acad-3', 'academic', '3', NULL, 'Result of Class XI (2023-24)', '#', 'Not Available'),
('acad-4', 'academic', '4', NULL, 'Result of Class XII (2023-24)', '#', 'Not Available'),
('acad-5', 'academic', '5', NULL, 'School Calendar', '/documents/Calander.pdf', '✓ Available');

-- INFRASTRUCTURE Category
INSERT INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-1', 'infrastructure', '1', NULL, 'No. and size of the class rooms (in sq mtr)', '#', 'Not Available'),
('infra-2', 'infrastructure', '2', NULL, 'No. and size of laboratories including computer labs (in sq mtr)', '#', 'Not Available'),
('infra-3', 'infrastructure', '3', NULL, 'No. and size of other rooms (in sq mtr)', '#', 'Not Available'),
('infra-4', 'infrastructure', '4', NULL, 'Drinking Water Sanitation certificate', '/documents/Drinking water Sanitation certificate.pdf', '✓ Available'),
('infra-5', 'infrastructure', '5', NULL, 'Water testing report', '/documents/Water testing report.pdf', '✓ Available'),
('infra-6', 'infrastructure', '6', NULL, 'Building Safety certificate', '/documents/Building safty certificate.pdf', '✓ Available'),
('infra-7', 'infrastructure', '7', NULL, 'Fire certificate', '/documents/fire.pdf', '✓ Available'),
('infra-8', 'infrastructure', '8', NULL, 'INFRASTRUCTURE DETAILS DOCUMENT', '/documents/INFRASTRUCTURE.pdf', '✓ Available'),
('infra-9', 'infrastructure', '9', NULL, 'Land certificate', '/documents/land.pdf', '✓ Available');

-- Verify:
-- SELECT COUNT(*) FROM documents; -- Should be 22
-- SELECT category, COUNT(*) FROM documents GROUP BY category;
-- SELECT id, category, sno, information, link, status FROM documents WHERE status = '✓ Available' ORDER BY category, CAST(sno AS UNSIGNED);
