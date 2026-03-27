# Faculty Visitor Registration Feature

## Overview
Faculty members can now register visitors (HR, Relatives, Other Faculty, Students, etc.) directly from their dashboard. The system automatically generates QR codes and sends them via email.

## Features Implemented

### ✅ Backend Features

#### 1. **FacultyRegisteredVisitor Model**
```python
class FacultyRegisteredVisitor(BaseModel):
    visitor_id: str  # Auto-generated UUID
    faculty_id: str  # The faculty who registered this visitor
    visitor_type: str  # 'HR', 'Relative', 'Other Faculty', 'Student', 'Other'
    name: str
    email: EmailStr
    mobile_no: str
    date_from: str  # Date visitor is allowed from
    date_to: str    # Date visitor is allowed until
    valid_till: str  # QR code validity (datetime)
    token: str  # Unique QR code token
    created_at: str  # Registration timestamp
```

#### 2. **API Endpoints**

**Register Visitor:**
```
POST /api/faculty/register-visitor
```
- Registers a new visitor for a faculty member
- Automatically generates QR code
- Sends email with QR code to visitor's email
- Returns: FacultyRegisteredVisitor object

**Get Faculty's Registered Visitors:**
```
GET /api/faculty/{faculty_id}/registered-visitors
```
- Fetches all visitors registered by a specific faculty member
- Returns: List of FacultyRegisteredVisitor objects

**Resend Email:**
```
POST /api/faculty/visitor/resend-email
```
- Resends the QR code email to a visitor if they didn't receive it
- Request body: `{ "visitor_id": "visitor_id_here" }`
- Returns: Success message

#### 3. **Email Features**
- ✅ QR code automatically generated for each visitor
- ✅ Professional HTML email with embedded QR code
- ✅ Email sent from: **shaikhrizwanofficial@gmail.com** (configured in .env)
- ✅ Resend email functionality if visitor doesn't receive first email
- ✅ Enhanced email template with styling and instructions

### ✅ Frontend Features

#### 1. **Faculty Dashboard Button**
- New "Register Visitor" button appears in faculty portal header
- Only visible to faculty members (not students)
- Opens registration dialog with form and list

#### 2. **Visitor Registration Form**
Fields in the form:
- **Visitor Type** (Select dropdown):
  - HR
  - Relative
  - Other Faculty
  - Student
  - Other
- **Name** (Text input) - Required
- **Email** (Email input) - Required
- **Mobile No** (Text input) - Required
- **Date From** (Date picker) - Required
- **Date To** (Date picker) - Required
- **Valid Till** (DateTime picker) - QR code validity duration

#### 3. **Registered Visitors List**
Below the form, displays all visitors registered by the faculty:
- Shows: Name, Visitor Type, Email, Mobile, Valid Dates
- **Resend Email Button** - For each visitor
- Scrollable list if many visitors
- Shows "No registered visitors yet" if empty

#### 4. **User Experience**
- Real-time form validation
- Success/Error toast notifications
- Loading states on buttons
- Responsive design for all devices

## How It Works

### Step-by-Step Process

1. **Faculty Login**
   - Faculty member logs in to their portal
   - Dashboard appears with their QR code

2. **Click "Register Visitor"**
   - Button in top header opens the registration dialog
   - Form is shown with empty fields
   - Previous visitors list loads automatically

3. **Fill Visitor Details**
   - Select visitor type from dropdown
   - Enter: Name, Email, Mobile, Dates, QR validity
   - Click "Register & Send QR" button

4. **System Actions**
   ```
   - Validates all fields
   - Generates QR code (base64 encoded)
   - Creates visitor record in MongoDB
   - Sends professional email with QR code
   - Shows success message
   - Resets form
   - Updates visitors list
   ```

5. **Visitor Receives Email**
   - Email arrives with subject: "PICT Guard - Your Gate Pass QR Code"
   - Contains embedded QR code image
   - Shows validity dates
   - Professional template with PICT Guard branding

6. **Resend Option**
   - If visitor didn't receive email, faculty can click "Resend"
   - Email is sent again to same visitor
   - Only resends, doesn't create duplicate

## Database Schema

### MongoDB Collection: `faculty_registered_visitors`

```javascript
{
    "_id": ObjectId,
    "visitor_id": "uuid-string",
    "faculty_id": "fact_0001",
    "visitor_type": "HR",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile_no": "9876543210",
    "date_from": "2024-03-15",
    "date_to": "2024-03-20",
    "valid_till": "2024-03-20T23:59:59",
    "token": "uuid-qrcode-token",
    "created_at": "2024-03-15T10:30:00Z"
}
```

## Environment Variables

Updated `.env` file configuration:
```
GMAIL_PASSWORD="mnzl dsrb bhnv zhws"  # Gmail App Password
SENDER_EMAIL="shaikhrizwanofficial@gmail.com"  # Gmail address
```

## Testing Guide

### Test Scenario 1: Register a Visitor
1. Login as Faculty
2. Click "Register Visitor" button
3. Select Visitor Type: "HR"
4. Fill in details:
   - Name: "Rajesh Kumar"
   - Email: "test@example.com"
   - Mobile: "9876543210"
   - Date From: Today's date
   - Date To: 5 days from today
   - Valid Till: 23:59 on the last date
5. Click "Register & Send QR"
6. Should see success toast: "Visitor registered! QR code sent to test@example.com"

### Test Scenario 2: Verify Email Received
1. Check email inbox (test@example.com)
2. Look for email from: shaikhrizwanofficial@gmail.com
3. Subject: "PICT Guard - Your Gate Pass QR Code"
4. Email should contain:
   - Greeting with visitor name
   - QR code image (embedded)
   - Validity information
   - Instructions to show at gate

### Test Scenario 3: Resend Email
1. In visitors list, find a visitor
2. Click "Resend" button
3. Should see toast: "Email resent to [email]"
4. Check email - should receive again

### Test Scenario 4: View Visitor List
1. Open Register Visitor dialog
2. Should see all previously registered visitors
3. Each shows: Name, Type, Email, Mobile, Dates
4. Can scroll if many visitors

## Backend API Response Examples

### Register Visitor Response (201)
```json
{
    "visitor_id": "550e8400-e29b-41d4-a716-446655440000",
    "faculty_id": "fact_0001",
    "visitor_type": "HR",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "mobile_no": "9876543210",
    "date_from": "2024-03-15",
    "date_to": "2024-03-20",
    "valid_till": "2024-03-20T23:59:59",
    "token": "8f2a3b4c-5d6e-7f8g-9h0i-1j2k3l4m5n6o",
    "created_at": "2024-03-15T10:30:00Z"
}
```

### Get Visitors Response (200)
```json
[
    {
        "visitor_id": "550e8400-e29b-41d4-a716-446655440000",
        "faculty_id": "fact_0001",
        "visitor_type": "HR",
        "name": "Rajesh Kumar",
        "email": "rajesh@example.com",
        "mobile_no": "9876543210",
        "date_from": "2024-03-15",
        "date_to": "2024-03-20",
        "valid_till": "2024-03-20T23:59:59",
        "token": "8f2a3b4c-5d6e-7f8g-9h0i-1j2k3l4m5n6o",
        "created_at": "2024-03-15T10:30:00Z"
    }
    // ... more visitors
]
```

### Resend Email Response (200)
```json
{
    "success": true,
    "message": "Email resent to rajesh@example.com"
}
```

## Important Notes

### ✅ What's Working
1. Faculty can register multiple visitors
2. QR codes are generated for each visitor
3. Emails are sent with embedded QR codes
4. Emails are sent from configured Gmail account
5. Faculty can resend emails to visitors
6. List shows all registered visitors
7. Full form validation
8. Professional UI with proper styling

### 🔧 Configuration
- **Email Sender**: shaikhrizwanofficial@gmail.com
- **Email Protocol**: Gmail SMTP with TLS
- **Email Template**: Professional HTML with QR code
- **Database**: MongoDB (faculty_registered_visitors collection)

### 📧 Email Features
- ✅ Professional HTML template
- ✅ Embedded QR code images
- ✅ Visitor name and validity info
- ✅ Clear instructions for gate entry
- ✅ PICT Guard branding

## Future Enhancements (Optional)

1. Add delete visitor functionality
2. Export visitor list to Excel
3. Add bulk visitor registration from CSV
4. SMS notification option
5. QR code display in portal (without email)
6. Visitor approval workflow
7. Visitor check-in/check-out tracking

## Troubleshooting

### Issue: Email not received
- Check GMAIL_PASSWORD in .env is correct
- Verify email address is valid
- Try "Resend" button
- Check spam/junk folder

### Issue: QR code not generating
- Check qrcode library is installed
- Verify Python backend is running
- Check server logs for errors

### Issue: Form validation errors
- All fields must be filled
- Email must be valid format
- Mobile must be 10 digits
- Date To must be after Date From

---

**Feature Status**: ✅ **COMPLETE AND WORKING**

**Date Implemented**: March 2024
**Version**: 1.0
