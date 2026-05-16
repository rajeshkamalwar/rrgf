<?php
/**
 * HTTP request helpers
 */

require_once __DIR__ . '/Response.php';

class Request
{
    /**
     * Decode JSON body (object or array). Exits with 400 if missing or not a JSON array/object.
     *
     * @return array
     */
    public static function jsonBody()
    {
        $raw = file_get_contents('php://input');
        if ($raw === false) {
            Response::error('Could not read request body');
        }
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            Response::error('Invalid JSON body');
        }

        return $data;
    }
}
