-- Check documents status in production database
-- Run these queries to diagnose document issues

-- 1. Count total documents
SELECT COUNT(*) as total_documents FROM documents;

-- 2. Count by category
SELECT category, COUNT(*) as count FROM documents GROUP BY category;

-- 3. Check documents with links (should be available)
SELECT id, category, sno, information, link, status 
FROM documents 
WHERE link != '#' AND link != '' AND status = '✓ Available'
ORDER BY category, CAST(sno AS UNSIGNED);

-- 4. Check documents without links or wrong status
SELECT id, category, sno, information, link, status 
FROM documents 
WHERE link = '#' OR link = '' OR status != '✓ Available'
ORDER BY category, CAST(sno AS UNSIGNED);

-- 5. Check for documents with /uploads/ paths (incorrect)
SELECT id, category, sno, information, link, status 
FROM documents 
WHERE link LIKE '%/uploads/%' OR link LIKE '%uploads/%'
ORDER BY category, CAST(sno AS UNSIGNED);

-- 6. List all documents with their current state
SELECT id, category, sno, 
       COALESCE(information, document, 'N/A') as name,
       link, 
       status 
FROM documents 
ORDER BY category, CAST(sno AS UNSIGNED);
