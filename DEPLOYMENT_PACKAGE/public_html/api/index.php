<?php
/**
 * Hostinger / LiteSpeed shim: ensures /api/* is handled by PHP (not the SPA index.html).
 * The real router lives under php-backend/api/index.php and reads RRGF_API_URI when set.
 */
declare(strict_types=1);

require dirname(__DIR__) . '/php-backend/api/index.php';
