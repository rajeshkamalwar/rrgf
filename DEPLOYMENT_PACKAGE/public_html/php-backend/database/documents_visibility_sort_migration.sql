-- Add visibility + manual sort order for mandatory disclosure documents (run once per database).

ALTER TABLE `documents`
  ADD COLUMN `sort_order` INT NOT NULL DEFAULT 0 AFTER `status`,
  ADD COLUMN `hidden_from_public` TINYINT(1) NOT NULL DEFAULT 0 AFTER `sort_order`;

UPDATE `documents` SET `sort_order` = CAST(`sno` AS UNSIGNED);
