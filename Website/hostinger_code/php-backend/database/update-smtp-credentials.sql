-- Update SMTP Configuration with Correct Credentials
-- Run this SQL query in phpMyAdmin to update SMTP settings

UPDATE smtp_config 
SET 
    host = 'smtp.hostinger.com',
    port = 465,
    user = 'info@rrgreenfieldmadhepura.in',
    password = TO_BASE64('Welcome@2026@#'),
    `from` = 'info@rrgreenfieldmadhepura.in',
    `to` = 'rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com'
ORDER BY id DESC 
LIMIT 1;

-- Note: If TO_BASE64 doesn't work in MySQL, use this instead:
-- password = CONVERT('Welcome@2026@#' USING utf8mb4) 
-- Then encode in PHP with: base64_encode('Welcome@2026@#')
-- Or update via admin panel which handles encoding automatically

-- Verify the update:
SELECT 
    id,
    host,
    port,
    user,
    `from`,
    `to`,
    CASE 
        WHEN password IS NOT NULL AND password != '' THEN '[PASSWORD SET]'
        ELSE 'NOT SET'
    END as password_status
FROM smtp_config 
ORDER BY id DESC 
LIMIT 1;
