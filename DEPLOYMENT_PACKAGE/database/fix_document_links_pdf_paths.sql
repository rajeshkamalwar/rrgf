-- Fix MPD infrastructure / document rows still pointing to '#' so the public page shows PDF links.
-- Matches files shipped under Website/public/documents/.
-- Safe to run multiple times.

UPDATE `documents` SET `information`='Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', `link`='#', `status`='Not Applicable' WHERE `id`='doc-1';

UPDATE `documents` SET `link`='/documents/trustdeed.pdf', `status`='✓ Available' WHERE `id`='doc-2';
UPDATE `documents` SET `link`='/documents/Registration Certificate.pdf', `status`='✓ Available' WHERE `id`='doc-3';
UPDATE `documents` SET `link`='/documents/NOC.pdf', `status`='✓ Available' WHERE `id`='doc-4';
UPDATE `documents` SET `link`='/documents/RTE.pdf', `status`='✓ Available' WHERE `id`='doc-5';
UPDATE `documents` SET `link`='/documents/Self Certification proforma.pdf', `status`='✓ Available' WHERE `id`='doc-6';
UPDATE `documents` SET `link`='/documents/PTA.pdf', `status`='✓ Available' WHERE `id`='doc-7';
UPDATE `documents` SET `link`='/documents/SMC_List.pdf', `status`='✓ Available' WHERE `id`='doc-8';

INSERT IGNORE INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('doc-9', 'documents', '9', NULL, 'Fees structure', '/documents/Fees structure.pdf', '✓ Available');

INSERT IGNORE INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('acad-5', 'academic', '5', NULL, 'School Calendar', '/documents/Calander.pdf', '✓ Available');

UPDATE `documents` SET `link`='/documents/Drinking water Sanitation certificate.pdf', `status`='✓ Available' WHERE `id`='infra-4';
UPDATE `documents` SET `link`='/documents/Water testing report.pdf', `status`='✓ Available' WHERE `id`='infra-5';
UPDATE `documents` SET `link`='/documents/Building safty certificate.pdf', `status`='✓ Available', `information`='Building Safety certificate' WHERE `id`='infra-6';
UPDATE `documents` SET `link`='/documents/fire.pdf', `status`='✓ Available' WHERE `id`='infra-7';
UPDATE `documents` SET `link`='/documents/INFRASTRUCTURE.pdf', `status`='✓ Available',
  `information`='INFRASTRUCTURE DETAILS DOCUMENT' WHERE `id`='infra-8';

INSERT IGNORE INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-9', 'infrastructure', '9', NULL, 'Land certificate', '/documents/land.pdf', '✓ Available');

INSERT IGNORE INTO `documents` (`id`, `category`, `sno`, `document`, `information`, `link`, `status`) VALUES
('infra-10', 'infrastructure', '10', NULL, 'Infrastructure layout / site photograph (JPEG)', '/documents/infradoc.jpeg', '✓ Available');
