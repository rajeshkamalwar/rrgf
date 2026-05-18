<?php
/**
 * Ensures documents table has columns required by MPD admin (sort_order, hidden_from_public, segment_id).
 * Safe to call on every request — runs ALTER only when a column is missing.
 */

class DocumentsSchema
{
    /** @var bool */
    private static $ensured = false;

    public static function ensure(Database $db): void
    {
        if (self::$ensured) {
            return;
        }

        $pdo = $db->getConnection();

        if (!self::columnExists($pdo, 'documents', 'hidden_from_public')) {
            $pdo->exec(
                'ALTER TABLE documents ADD COLUMN hidden_from_public TINYINT(1) NOT NULL DEFAULT 0'
            );
        }

        if (!self::columnExists($pdo, 'documents', 'sort_order')) {
            $pdo->exec('ALTER TABLE documents ADD COLUMN sort_order INT NOT NULL DEFAULT 0');
            try {
                $pdo->exec('UPDATE documents SET sort_order = CAST(sno AS UNSIGNED)');
            } catch (Throwable $e) {
                error_log('DocumentsSchema sort_order backfill: ' . $e->getMessage());
            }
        }

        if (!self::columnExists($pdo, 'documents', 'segment_id')) {
            $pdo->exec(
                'ALTER TABLE documents ADD COLUMN segment_id VARCHAR(64) DEFAULT NULL AFTER category'
            );
        }

        self::$ensured = true;
    }

    private static function columnExists(PDO $pdo, string $table, string $column): bool
    {
        $stmt = $pdo->prepare(
            'SELECT COUNT(*) FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
        );
        $stmt->execute([$table, $column]);

        return (int) $stmt->fetchColumn() > 0;
    }
}
