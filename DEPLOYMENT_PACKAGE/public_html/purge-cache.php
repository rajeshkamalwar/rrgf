<?php
// LiteSpeed cache purge via PHP
header('X-LiteSpeed-Purge: *');
header('X-LiteSpeed-Cache-Control: no-cache');

if (function_exists('litespeed_purge_all')) {
    litespeed_purge_all();
    echo 'Purged via litespeed_purge_all()';
} else {
    echo 'Purge header sent (X-LiteSpeed-Purge: *)';
}
echo PHP_EOL;
echo 'Done. Now visit https://rrgreenfieldmadhepura.in/ and it should load fresh.';
