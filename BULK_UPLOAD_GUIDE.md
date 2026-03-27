# Bulk Upload Guide for Gate Pass System

This guide explains the correct Excel format for bulk uploading students, faculty, and event students.

## Faculty Bulk Upload

### Method 1: Without Faculty ID (Recommended - Auto-generated)
Upload an Excel file with exactly **6 columns** in this order:

| Name | Email | Mobile | Department | Profession | Valid Till |
|------|-------|--------|------------|-----------|-----------|
| Dr. John Doe | john@example.com | 9876543210 | CSE | Professor | 2025-12-31 |
| Dr. Jane Smith | jane@example.com | 9876543211 | ECE | Associate Prof | 2025-12-31 |

**Column Details:**
- **Name**: Faculty full name (text)
- **Email**: Valid email address (must be unique)
- **Mobile**: 10-digit mobile number (must be unique)
- **Department**: Department name (text)
- **Profession**: Job title (text)
- **Valid Till**: Expiry date (YYYY-MM-DD format)

### Method 2: With Faculty ID (First column ignored)
If your Excel includes Faculty ID in the first column, the system will **automatically skip it**:

| Faculty ID | Name | Email | Mobile | Department | Profession | Valid Till |
|-----------|------|-------|--------|------------|-----------|-----------|
| F001 | Dr. John Doe | john@example.com | 9876543210 | CSE | Professor | 2025-12-31 |
| F002 | Dr. Jane Smith | jane@example.com | 9876543211 | ECE | Associate Prof | 2025-12-31 |

---

## Student Bulk Upload

### Method 1: Without Student ID (Recommended - 6 columns)
Upload an Excel file with exactly **6 columns** in this order:

| RegNo | Name | Email | Mobile | DOB | Year |
|-------|------|-------|--------|-----|------|
| 12101001 | Raj Kumar | raj@student.com | 9876543210 | 2003-05-15 | 3 |
| 12101002 | Priya Singh | priya@student.com | 9876543211 | 2003-06-20 | 3 |

**Column Details:**
- **RegNo**: Registration number (unique identifier)
- **Name**: Student full name
- **Email**: Valid email address (must be unique)
- **Mobile**: 10-digit mobile number (must be unique)
- **DOB**: Date of birth (YYYY-MM-DD format)
- **Year**: Current academic year (1, 2, 3, or 4)

### Method 2: With Student ID (First column ignored)
If your Excel includes Student ID in the first column, the system will **automatically skip it**:

| Student ID | RegNo | Name | Email | Mobile | DOB | Year |
|-----------|-------|------|-------|--------|-----|------|
| S001 | 12101001 | Raj Kumar | raj@student.com | 9876543210 | 2003-05-15 | 3 |
| S002 | 12101002 | Priya Singh | priya@student.com | 9876543211 | 2003-06-20 | 3 |

---

## Event Students Bulk Upload

### Method: Add students to an event

| RegNo |
|-------|
| 12101001 |
| 12101002 |
| 12101003 |

**Column Details:**
- **RegNo**: Student registration number (must exist in the system)

**Alternative: Manual entry for external/non-registered students**

| RegNo | Name | Email | Mobile |
|-------|------|-------|--------|
| EXT001 | External Student | external@example.com | 9876543212 |

---

## Important Rules

✅ **Do's:**
- Use unique email addresses and mobile numbers
- Ensure all required fields are filled
- Use correct date format: YYYY-MM-DD
- Save Excel file in .xlsx or .xls format
- Test with a few rows first before bulk uploading

❌ **Don'ts:**
- Leave any required cells empty
- Use duplicate emails or mobile numbers in the same upload
- Use special characters in names or departments
- Leave header row - data starts from row 2

---

## Error Messages and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Missing required columns | Too few columns in Excel | Ensure exactly 6 columns (or 7 if including auto-generated ID) |
| Missing required field(s) | One or more cells are empty | Check and fill all empty cells in the row |
| Invalid data format | Wrong data type (e.g., text in year field) | Year must be a number (1-4), DOB must be YYYY-MM-DD |
| Email already exists | Duplicate email in database | Use unique email address |
| Mobile already exists | Duplicate mobile in database | Use unique phone number |
| Student not found | RegNo doesn't exist in system | Add student to system first, or provide full manual entry |

---

## Upload Steps

1. **Prepare Excel file** with correct columns and format
2. **Go to Admin Dashboard** → Faculty/Student Management
3. **Click "Upload Excel" button**
4. **Select your file** and confirm
5. **Check results**: 
   - ✅ Shows number of records added
   - ⚠️ Shows number of duplicates skipped
   - ❌ Shows specific errors with row numbers

**Tip**: Check your browser console (F12) to see all detailed error messages if upload fails.

