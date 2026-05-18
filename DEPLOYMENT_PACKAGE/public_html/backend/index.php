<?php
/**
 * Admin UI lives at URL /backend (React Router). This file exists so Apache never
 * treats /backend/ as an empty browsable directory (403 "Directory access is forbidden").
 * The real shell is the root SPA entry (same as public site).
 */
require dirname(__DIR__) . '/appentry.php';
