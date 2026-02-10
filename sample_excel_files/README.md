# Sample Excel Files for Bulk Upload

This folder contains sample Excel files for testing bulk upload functionality in PICT Guard.

## Files Included

### 1. students_bulk_upload.xlsx
**Purpose**: Upload multiple students at once

**Format**:
| Column | Description | Example |
|--------|-------------|---------|
| Reg No | Unique registration number | S2024001 |
| Name | Student's full name | Rahul Sharma |
| Email | Student email address | rahul.sharma@pict.edu |
| Mobile | 10-digit mobile number | 9876543210 |
| DOB | Date of birth (YYYY-MM-DD) | 2002-03-15 |
| Current Year | Current academic year (1-4) | 2 |

**Contains**: 10 sample PICT students

**How to Use**:
1. Login to admin dashboard
2. Go to "Students" tab
3. Click "Bulk Upload (Excel)" section
4. Choose this file
5. Click "Upload" button

---

### 2. faculty_bulk_upload.xlsx
**Purpose**: Upload multiple faculty members at once

**Format**:
| Column | Description | Example |
|--------|-------------|---------|
| Name | Faculty member's full name | Dr. Rajesh Gupta |
| Email | Faculty email address | rajesh.gupta@pict.edu |
| Mobile | 10-digit mobile number | 9988776655 |
| Department | Department name | Computer Science |
| Profession | Position/designation | Professor |
| Valid Till | Validity end date (YYYY-MM-DD) | 2027-12-31 |

**Contains**: 8 sample faculty members

**How to Use**:
1. Login to admin dashboard
2. Go to "Faculty" tab
3. Click "Bulk Upload (Excel)" section
4. Choose this file
5. Click "Upload" button

**Note**: Faculty IDs are auto-generated as fact_0001, fact_0002, etc.

---

### 3. event_students_bulk_upload.xlsx
**Purpose**: Add multiple students to an event (supports both PICT and external college students)

**Format**:
| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| Reg No | Registration number | Yes | S2024001 or EXT001 |
| Name | Student name | For external only | Sanjay Mehta |
| Email | Student email | For external only | sanjay@coep.edu |
| Mobile | Student mobile | For external only | 9123456789 |

**Two Types of Entries**:

1. **PICT Students** (Registered in system):
   - Only provide Reg No
   - System automatically fetches name, email, mobile
   - Example: `S2024001`

2. **External College Students**:
   - Provide all 4 fields: Reg No, Name, Email, Mobile
   - Reg No can be any unique identifier (e.g., EXT001, MIT_001)
   - Example: `EXT001 | Sanjay Mehta | sanjay@coep.edu | 9123456789`

**Contains**: 8 sample entries (mix of PICT and external students)

**How to Use**:
1. Login to admin dashboard
2. Go to "Events" tab
3. Create an event first
4. Click on the event and select "View Students"
5. In the dialog, click "Bulk Add Students (Excel)"
6. Choose this file
7. Click "Upload" button

**Special Feature**: 
The file includes an "Instructions" sheet explaining the format in detail.

---

## Testing Workflow

### Complete Test Scenario:

1. **Upload Students**:
   - Use `students_bulk_upload.xlsx`
   - Verify 10 students added
   - Check auto-calculated validity dates

2. **Upload Faculty**:
   - Use `faculty_bulk_upload.xlsx`
   - Verify 8 faculty added
   - Check auto-generated Faculty IDs (fact_0001, fact_0002, etc.)

3. **Create Event**:
   - Manually create an event (e.g., "Tech Fest 2026")
   - Set date range (e.g., March 1-3, 2026)

4. **Add Students to Event**:
   - Use `event_students_bulk_upload.xlsx`
   - Verify both PICT and external students added
   - Check QR codes generated
   - Verify emails sent (if configured)

5. **Test Validation**:
   - Login as student
   - View QR code
   - Use guard scanner to validate

---

## Customization Guide

### To Create Your Own Excel Files:

#### Students File:
```excel
Reg No      | Name           | Email                  | Mobile     | DOB        | Current Year
S2024001    | John Doe       | john.doe@pict.edu     | 9876543210 | 2002-01-15 | 2
S2024002    | Jane Smith     | jane.smith@pict.edu   | 9876543211 | 2001-08-20 | 3
```

#### Faculty File:
```excel
Name              | Email                  | Mobile     | Department     | Profession | Valid Till
Dr. John Smith    | john.s@pict.edu       | 9988776655 | CS             | Professor  | 2027-12-31
Prof. Jane Doe    | jane.d@pict.edu       | 9988776656 | IT             | Asst Prof  | 2027-12-31
```

#### Event Students File:
```excel
Reg No    | Name          | Email              | Mobile
S2024001  |               |                    |                  <- PICT student (only Reg No)
EXT001    | Amit Kumar    | amit@coep.edu     | 9123456789      <- External student (all fields)
```

---

## Important Notes

1. **Excel Format**: Files must be .xlsx or .xls format
2. **Headers Required**: First row must contain column headers
3. **Data Starts Row 2**: Actual data starts from row 2
4. **No Empty Rows**: Skip or delete empty rows between data
5. **Date Format**: Use YYYY-MM-DD format for dates
6. **Email Validation**: Valid email format required
7. **Mobile Format**: 10-digit numbers only

---

## Error Handling

The system will report errors for:
- Duplicate registration numbers
- Invalid email formats
- Missing required fields
- Invalid date formats
- Students not found (for event assignments)

**Success Message**: Shows count of successfully added records
**Error List**: Shows row-wise errors if any

---

## For Presentation

**Quick Demo**:
1. Show empty tables in admin dashboard
2. Upload `students_bulk_upload.xlsx` → 10 students added instantly
3. Upload `faculty_bulk_upload.xlsx` → 8 faculty added instantly
4. Create sample event → Add students using `event_students_bulk_upload.xlsx`
5. Show event students table with mix of PICT and external students

This demonstrates:
- ✅ Bulk upload capability
- ✅ Efficient data entry
- ✅ External student support
- ✅ Email automation
- ✅ Scalability for large datasets

---

## Support

For issues or questions about bulk upload:
1. Check file format matches examples
2. Verify Excel file isn't corrupted
3. Check admin dashboard error messages
4. Review backend logs for detailed errors

---

**Location**: `/app/sample_excel_files/`
**Last Updated**: February 10, 2026
**Created for**: PICT Guard Presentation Demo
