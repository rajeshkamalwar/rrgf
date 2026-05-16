-- MPD Disclosure table migration
-- Creates the mpd_disclosure table used by MpdDisclosureService
-- Safe to run multiple times (IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS `mpd_disclosure` (
  `id`           INT          NOT NULL DEFAULT 1,
  `payload_json` LONGTEXT     NOT NULL,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
