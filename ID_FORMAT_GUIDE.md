# PICT Guard - ID Format Guide

## Overview
PICT Guard uses standardized ID formats for all users to ensure consistency and easy identification across the system.

---

## Student ID Format

### Format: `PICT-STD-XXX`
- **Prefix**: `PICT-STD` (PICT Student)
- **Count**: 3-digit sequential number (001, 002, 003, etc.)
- **Examples**: 
  - `PICT-STD-001` (First student)
  - `PICT-STD-042` (42nd student)
  - `PICT-STD-100` (100th student)

### How it's Generated
- **Automatically generated** by the system when student data is uploaded
- **Sequential**: Each new student gets the next available number
- **Cannot be manually changed** during bulk upload

### Excel Upload for Students
When uploading students via Excel:
1. **Do NOT include** a Student ID column
2. **Provide these columns only**:
   - Name (Text)
   - Email (Valid email format)
   - Mobile (10 digits)
   - DOB (YYYY-MM-DD format)
   - Year (1, 2, 3, or 4)

The system will automatically assign `PICT-STD-XXX` IDs

---

## Faculty ID Format

### Format: `PICT-FAC-XXX`
- **Prefix**: `PICT-FAC` (PICT Faculty)
- **Count**: 3-digit sequential number (001, 002, 003, etc.)
- **Examples**:
  - `PICT-FAC-001` (First faculty member)
  - `PICT-FAC-015` (15th faculty member)
  - `PICT-FAC-050` (50th faculty member)

### How it's Generated
- **Automatically generated** by the system when faculty data is uploaded
- **Sequential**: Each new faculty member gets the next available number
- **Cannot be manually changed** during bulk upload

### Excel Upload for Faculty
When uploading faculty via Excel:
1. **Do NOT include** a Faculty ID column
2. **Provide these columns only**:
   - Name (Text)
   - Email (Valid email format)
   - Mobile (10 digits)
   - Department (Text)
   - Profession (Text - e.g., Professor, Associate Professor, Lecturer)
   - Valid Till (YYYY-MM-DD format)

The system will automatically assign `PICT-FAC-XXX` IDs

---

## Visitor ID Format

### Format: Visitor Registration Number
- **Format**: System-generated UUID or custom format as needed
- **Currently**: Uses token-based approach for pass generation

### Registration Details
Visitors provide:
- Full Name
- Phone Number
- Email
- ID Type (Aadhar, Passport, Driving License, etc.)
- ID Number (from provided ID)
- Person to Visit (Faculty/Student ID or name)
- Purpose of Visit

---

## Alumni ID Format

### Format: Automatic based on enrollment
- **Enrollment Number**: From their study period
- **Format**: YYYY-BRANCH-XXX (e.g., 2019-IT-045)

### Details Required
- First Name, Middle Name, Last Name
- Email & Mobile
- Degree & Branch
- Year of Joining & Passing
- Current Company & Designation
- LinkedIn Profile (Optional)

---

## Key Points

### ✅ DO:
- Upload student/faculty data without ID columns
- Use the Excel templates provided
- Ensure all required fields are filled
- Follow date format YYYY-MM-DD
- Use 10-digit mobile numbers
- Ensure emails are unique per person

### ❌ DON'T:
- Manually enter Student/Faculty IDs in Excel
- Leave required fields empty
- Use duplicate emails or phone numbers
- Modify ID format after generation
- Use inconsistent date formats

---

## Bulk Upload Steps

### Students:
1. Download the student template: `students_bulk_upload.xlsx`
2. Fill in only: Name, Email, Mobile, DOB, Year
3. Upload via Admin Dashboard
4. System auto-generates `PICT-STD-XXX` IDs

### Faculty:
1. Download the faculty template: `faculty_bulk_upload.xlsx`
2. Fill in only: Name, Email, Mobile, Department, Profession, Valid Till
3. Upload via Admin Dashboard
4. System auto-generates `PICT-FAC-XXX` IDs

---

## Troubleshooting

### Issue: "Faculty ID format changing"
- **Cause**: Previous system used `fact_0001` format
- **Solution**: System now uses `PICT-FAC-XXX` format for all new uploads
- **Backward Compatibility**: Old `fact_XXXX` records still work, but all new records use `PICT-FAC-XXX`

### Issue: "Student registration changing"
- **Cause**: Previously used manual reg_no from Excel
- **Solution**: Now auto-generates `PICT-STD-XXX` format
- **Benefit**: Ensures no duplicate reg_no numbers

### Issue: "Duplicate ID errors"
- **Cause**: Email or Mobile number already exists
- **Solution**: Use unique email and mobile for each person
- **Check**: Verify the person isn't already in the system

---

## Format Consistency Across System

| User Type | ID Format | Auto-Generated | Example |
|-----------|-----------|----------------|---------|
| Student | PICT-STD-XXX | ✓ Yes | PICT-STD-042 |
| Faculty | PICT-FAC-XXX | ✓ Yes | PICT-FAC-015 |
| Visitor | Token-based | ✓ Yes | (UUID) |
| Alumni | Enrollment-based | ✓ Yes | 2019-IT-045 |

---

## Questions?

For more details, contact the PICT IT Department or check the admin documentation.
