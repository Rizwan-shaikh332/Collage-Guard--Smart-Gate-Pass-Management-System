# PICT Guard - Smart Gate Pass Management System

A modern, secure, and efficient college gate pass management system with QR code-based authentication.

## 🚀 Features

### For Admin
- **Dashboard**: Real-time statistics showing visitors today, total students, faculty, and events
- **Student Management**: Add students individually or bulk upload via Excel
- **Faculty Management**: Add faculty members with auto-generated IDs (fact_0001, fact_0002, etc.)
- **Event Management**: Create events and assign students with time-bound passes
- **Automated Emails**: QR codes automatically sent to event participants

### For Students & Faculty
- **Login**: Secure login using email and mobile number
- **Digital ID Card**: Professional digital gate pass with QR code
- **Auto-Validity**: Students' validity calculated based on current year (up to 4th year)
- **Web & Mobile Access**: Access from both website and mobile app

### For Visitors & Alumni
- **Public Registration**: Self-registration form accessible without login
- **Photo Capture**: Built-in camera feature for selfie capture
- **24-Hour Passes**: Automatically generated QR codes valid for 24 hours
- **Email Delivery**: QR code sent to registered email instantly

### For Guards
- **Simple Scanner Interface**: Dedicated portal for QR validation
- **Traffic Light Feedback**: Full-screen green (valid) or red (invalid) indication
- **Instant Validation**: Real-time checking of QR code validity
- **Multiple Devices**: Support for multiple guard terminals (guard1, guard2, etc.)

## 🏗️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Async MongoDB driver
- **Resend**: Email service for QR code delivery
- **QRCode**: Python library for QR code generation
- **OpenPyXL**: Excel file processing for bulk uploads

### Frontend (Website)
- **React 19**: Modern UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Professional component library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **QRCode.react**: QR code display
- **React Webcam**: Camera integration
- **Sonner**: Toast notifications

### Mobile App
- **React Native**: Cross-platform mobile development (iOS & Android)
- **Same Backend**: Unified API for web and mobile

## 📋 Database Schema

### Students Collection
```json
{
  "reg_no": "unique_registration_number",
  "name": "Student Name",
  "email": "student@email.com",
  "mobile_no": "1234567890",
  "dob": "2000-01-01",
  "current_year": 2,
  "token": "unique_uuid",
  "valid_till": "2027-12-31T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Faculty Collection
```json
{
  "faculty_id": "fact_0001",
  "name": "Faculty Name",
  "email": "faculty@email.com",
  "mobile_no": "1234567890",
  "department": "Computer Science",
  "profession": "Professor",
  "token": "unique_uuid",
  "valid_till": "2027-12-31T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Visitors Collection
```json
{
  "name": "Visitor Name",
  "email": "visitor@email.com",
  "mobile_no": "1234567890",
  "person_to_visit": "Faculty/Student Name",
  "photo_base64": "base64_encoded_image",
  "purpose": "Meeting",
  "token": "unique_uuid",
  "valid_till": "2026-02-11T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Alumni Collection
```json
{
  "name": "Alumni Name",
  "email": "alumni@email.com",
  "mobile_no": "1234567890",
  "college_department": "Computer Engineering",
  "photo_base64": "base64_encoded_image",
  "purpose": "Campus Visit",
  "current_company": "Tech Corp",
  "job_position": "Software Engineer",
  "specialization": "AI/ML",
  "ctc_monthly": "100000",
  "other_details": "Additional info",
  "token": "unique_uuid",
  "valid_till": "2026-02-11T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Events Collection
```json
{
  "event_id": "unique_uuid",
  "event_name": "Tech Fest 2026",
  "event_type": "Festival",
  "date_from": "2026-03-01",
  "date_to": "2026-03-03",
  "description": "Annual tech festival",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Event Students Collection
```json
{
  "event_id": "unique_uuid",
  "reg_no": "student_reg_no",
  "name": "Student Name",
  "email": "student@email.com",
  "mobile_no": "1234567890",
  "token": "unique_uuid",
  "valid_from": "2026-03-01",
  "valid_to": "2026-03-03",
  "created_at": "2026-02-10T00:00:00Z"
}
```

## 🔐 Demo Credentials

### Admin Login
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

### Guard Login
- **URL**: `/guard/login`
- **Username**: `guard1` (or guard2, guard3, etc.)
- **Password**: `guard123`

### Student/Faculty Login
- **URL**: `/user/login`
- **Email**: Student/Faculty email from database
- **Password**: Mobile number from database

## 🎯 Workflow

### Admin Workflow
1. Login to admin portal
2. View dashboard with real-time statistics
3. Add students individually or upload Excel file
4. Add faculty members with validity dates
5. Create events and assign students
6. System automatically generates QR codes and sends emails

### Student/Faculty Workflow
1. Login using email and mobile number
2. View digital ID card with QR code
3. Show QR code at gate for entry
4. QR code contains validity information

### Visitor/Alumni Workflow
1. Navigate to public registration page
2. Fill registration form
3. Capture selfie using camera
4. Submit and receive QR code instantly
5. QR code sent to email
6. Valid for 24 hours only

### Guard Workflow
1. Login to guard portal
2. Scan or enter QR token
3. System validates and shows:
   - **Green Screen**: Valid entry with user details
   - **Red Screen**: Invalid/expired with reason
4. Auto-clears after 5 seconds for next scan

## 📧 Email Configuration

The system uses Resend for sending emails with QR codes. To enable email functionality:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Update `/app/backend/.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   SENDER_EMAIL=onboarding@resend.dev
   ```
4. Restart backend: `sudo supervisorctl restart backend`

**Note**: Without API key, the system works but emails won't be sent.

## 📱 Mobile App

The mobile app is built with React Native and shares the same backend API. It provides:
- Student/Faculty login
- QR code display
- Guard scanner functionality

**Directory**: `/app/mobile-app` (to be developed)

## 🚦 QR Code Validation Logic

1. **Token-Based**: Each user gets a unique UUID token
2. **Time-Based**: Validity checked against current date/time
3. **Multi-Collection**: System checks all collections (students, faculty, visitors, alumni, event_students)
4. **Instant Feedback**: Real-time validation with clear visual indicators
5. **Auto-Expiry**: Visitor/Alumni passes expire after 24 hours
6. **Student Validity**: Calculated based on current year (e.g., 2nd year student = valid till 4th year)

## 📊 Bulk Upload Format

### Students Excel Format
| Reg No | Name | Email | Mobile | DOB | Current Year |
|--------|------|-------|--------|-----|-------------|
| S001 | John Doe | john@email.com | 1234567890 | 2000-01-01 | 2 |

### Faculty Excel Format
| Name | Email | Mobile | Department | Profession | Valid Till |
|------|-------|--------|------------|------------|------------|
| Dr. Smith | smith@email.com | 1234567890 | CS | Professor | 2027-12-31 |

### Event Students Excel Format
| Reg No |
|--------|
| S001 |
| S002 |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/login` - Student/Faculty login
- `POST /api/auth/guard/login` - Guard login

### Students
- `POST /api/students` - Add single student
- `POST /api/students/bulk` - Bulk upload students
- `GET /api/students` - Get all students

### Faculty
- `POST /api/faculty` - Add single faculty
- `POST /api/faculty/bulk` - Bulk upload faculty
- `GET /api/faculty` - Get all faculty

### Events
- `POST /api/events` - Create event
- `GET /api/events` - Get all events
- `POST /api/events/students` - Add student to event
- `POST /api/events/students/bulk` - Bulk add students to event
- `GET /api/events/{event_id}/students` - Get event students

### Visitors & Alumni
- `POST /api/visitors` - Register visitor
- `POST /api/alumni` - Register alumni

### Validation
- `POST /api/validate-qr` - Validate QR token

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🌐 Deployment

The system is containerized and ready for deployment on any Kubernetes cluster or cloud platform.

### Environment Variables
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `RESEND_API_KEY`: Email service API key
- `SENDER_EMAIL`: Email sender address
- `CORS_ORIGINS`: Allowed origins for CORS

## 🎨 Design Highlights

- **Professional Blue Corporate Theme**: Clean and institutional appearance
- **Responsive Design**: Works on all device sizes
- **Manrope Font**: Modern, professional headings
- **Public Sans Font**: Readable body text
- **JetBrains Mono**: For IDs and tokens
- **Traffic Light UI**: Intuitive guard scanner feedback
- **Glass Morphism**: Modern visual effects
- **High Contrast**: Excellent readability

## 📄 License

This project is developed for PICT (Pune Institute of Computer Technology) gate pass management.

## 🤝 Support

For any issues or questions, please refer to the RUN_README.md for local setup instructions.

---

**Built with ❤️ for PICT**