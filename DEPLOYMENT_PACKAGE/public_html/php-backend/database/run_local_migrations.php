<?php
/**
 * One-shot local dev migrations (run: php database/run_local_migrations.php)
 */
$config = require __DIR__ . '/../config/database.php';
$dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=%s',
    $config['host'],
    $config['dbname'],
    $config['charset'] ?? 'utf8mb4'
);
$pdo = new PDO($dsn, $config['username'], $config['password'], $config['options'] ?? []);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function columnExists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $stmt->execute([$table, $column]);
    return (int) $stmt->fetchColumn() > 0;
}

function tableExists(PDO $pdo, string $table): bool
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?'
    );
    $stmt->execute([$table]);
    return (int) $stmt->fetchColumn() > 0;
}

$steps = [];

if (!columnExists($pdo, 'documents', 'hidden_from_public')) {
    $pdo->exec('ALTER TABLE documents ADD COLUMN hidden_from_public TINYINT(1) NOT NULL DEFAULT 0');
    $steps[] = 'Added documents.hidden_from_public';
}
if (!columnExists($pdo, 'documents', 'sort_order')) {
    $pdo->exec('ALTER TABLE documents ADD COLUMN sort_order INT NOT NULL DEFAULT 0');
    $steps[] = 'Added documents.sort_order';
}
if (!columnExists($pdo, 'documents', 'segment_id')) {
    $pdo->exec('ALTER TABLE documents ADD COLUMN segment_id VARCHAR(64) DEFAULT NULL AFTER category');
    $steps[] = 'Added documents.segment_id';
}

try {
    $pdo->exec("ALTER TABLE documents MODIFY COLUMN category VARCHAR(64) NOT NULL DEFAULT 'documents'");
    $steps[] = 'Widened documents.category to VARCHAR(64)';
} catch (Throwable $e) {
    $steps[] = 'category widen skipped: ' . $e->getMessage();
}

if (!tableExists($pdo, 'mpd_disclosure')) {
    $sql = file_get_contents(__DIR__ . '/mpd_disclosure_migration.sql');
    $pdo->exec($sql);
    $steps[] = 'Created mpd_disclosure table';
}

if (count($steps) === 0) {
    echo "Nothing to migrate — schema already up to date.\n";
} else {
    foreach ($steps as $s) {
        echo $s . "\n";
    }
}
echo "Done.\n";
