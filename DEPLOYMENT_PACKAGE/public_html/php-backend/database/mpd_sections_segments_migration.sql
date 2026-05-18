-- Document sections (category) + optional segment mapping for MPD portal
-- Run once in phpMyAdmin. Safe to re-run (checks column existence).

ALTER TABLE `documents`
  MODIFY COLUMN `category` VARCHAR(64) NOT NULL DEFAULT 'documents';

-- segment_id: maps a row to a segment within its section (from mpd_disclosure.documentSections)
ALTER TABLE `documents`
  ADD COLUMN IF NOT EXISTS `segment_id` VARCHAR(64) DEFAULT NULL AFTER `category`;

CREATE INDEX IF NOT EXISTS `idx_documents_category_segment` ON `documents` (`category`, `segment_id`);
