# Fix Documents Database

## Problem
Documents table is messy on Hostinger production (wrong links, incorrect status, etc.)

## Solution Options

### Option 1: Update Existing Documents (Recommended)
Use this if documents exist but have wrong links/status:
- File: `database/fix-all-documents-production.sql`
- This updates existing records without deleting them
- Uses `ON DUPLICATE KEY UPDATE` to safely update

### Option 2: Complete Reset (If Table is Completely Messed Up)
Use this ONLY if documents are completely broken:
- File: `database/reset-documents-completely.sql`
- **WARNING**: Deletes ALL documents and recreates them
- **Backup your database first!**

### Option 3: Check Status First
Run diagnostic queries to see current state:
- File: `database/check-documents-status.sql`

## Quick Fix Steps

### Step 1: Check Current State
Run in phpMyAdmin:
```sql
SELECT COUNT(*) FROM documents;
SELECT id, category, sno, information, link, status FROM documents ORDER BY category, CAST(sno AS UNSIGNED);
```

### Step 2: Choose Fix Method

**If documents exist but are wrong:**
Run: `database/fix-all-documents-production.sql`
- Updates all documents with correct links and status
- Preserves existing records

**If documents table is completely broken:**
1. **BACKUP DATABASE FIRST!**
2. Run: `database/reset-documents-completely.sql`
3. This will delete and recreate all documents

### Step 3: Verify
After running the fix:
```sql
-- Count documents
SELECT COUNT(*) FROM documents; -- Should be 22

-- Check available documents
SELECT id, category, information, link, status 
FROM documents 
WHERE status = '✓ Available' 
ORDER BY category, CAST(sno AS UNSIGNED);
```

## Documents That Will Be Fixed

### Documents Category (9 documents):
- ✅ Trust Deed: `/documents/trustdeed.pdf`
- ✅ Registration Certificate: `/documents/Registration Certificate.pdf`
- ✅ NOC: `/documents/NOC.pdf`
- ✅ RTE: `/documents/RTE.pdf`
- ✅ Self Certification Proforma: `/documents/Self Certification proforma.pdf`
- ✅ PTA: `/documents/PTA.pdf`
- ✅ SMC List: `/documents/SMC_List.pdf`
- ✅ Fees structure: `/documents/Fees structure.pdf`
- ⚠️ Affiliation Letter: Not Available

### Academic Category (5 documents):
- ✅ School Calendar: `/documents/Calander.pdf`
- ⚠️ Class Results: Not Available (4 documents)

### Infrastructure Category (9 documents):
- ✅ Drinking Water Sanitation certificate: `/documents/Drinking water Sanitation certificate.pdf`
- ✅ Water testing report: `/documents/Water testing report.pdf`
- ✅ Building Safety certificate: `/documents/Building safty certificate.pdf`
- ✅ Fire certificate: `/documents/fire.pdf`
- ✅ INFRASTRUCTURE: `/documents/INFRASTRUCTURE.pdf`
- ✅ Land certificate: `/documents/land.pdf`
- ⚠️ Class rooms, Labs, Other rooms: Not Available (3 documents)

**Total: 22 documents** (14 with PDFs, 8 marked as "Not Available")

## Important Notes

1. **File Paths**: All paths use `/documents/` prefix which matches files in `public_html/documents/`
2. **Status**: Documents with PDFs get status "✓ Available", others get "Not Available"
3. **View Buttons**: Only documents with status "✓ Available" will show View buttons
4. **File Names**: Match exact file names in deployment package (case-sensitive)

## Verification Checklist

After fixing:
- [ ] All 22 documents exist in database
- [ ] Documents with PDFs have status "✓ Available"
- [ ] All links point to `/documents/filename.pdf`
- [ ] View buttons appear on mandatory disclosure page
- [ ] Clicking View buttons opens PDFs correctly
