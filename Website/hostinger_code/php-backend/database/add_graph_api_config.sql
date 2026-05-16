-- Add table for storing Microsoft Graph API credentials
-- This allows configuring Graph API through the admin panel instead of environment variables

CREATE TABLE IF NOT EXISTS `graph_api_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` varchar(255) NOT NULL COMMENT 'Azure Application (client) ID',
  `client_secret` varchar(500) NOT NULL COMMENT 'Azure Client Secret (encrypted or plain - for now plain)',
  `tenant_id` varchar(255) NOT NULL COMMENT 'Azure Directory (tenant) ID',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether Graph API is enabled',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial empty row (we'll update it via admin panel)
-- Only one row should exist
INSERT INTO `graph_api_config` (`client_id`, `client_secret`, `tenant_id`, `is_active`)
VALUES ('', '', '', 0)
ON DUPLICATE KEY UPDATE id=id;
