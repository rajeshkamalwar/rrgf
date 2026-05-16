-- CBSE Appendix-IX MPD disclosure (single-school JSON snapshot)
-- Run once on existing deployments (after schema.sql).

CREATE TABLE IF NOT EXISTS `mpd_disclosure` (
  `id` tinyint unsigned NOT NULL DEFAULT 1 PRIMARY KEY,
  `payload_json` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `mpd_disclosure` (`id`, `payload_json`)
VALUES (1, '{}');
