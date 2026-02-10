# PICT Guard Mobile App

## Overview

This document outlines the plan for the React Native mobile app that will work alongside the web application.

## Architecture

The mobile app will use the **same backend API** as the web application, ensuring consistency and reducing development overhead.

### Shared Components:
- Same authentication endpoints
- Same QR validation logic
- Same database (MongoDB)
- Unified user experience

## Features

### For Students & Faculty:
1. **Login Screen**
   - Email and mobile number authentication
   - Secure token-based session

2. **Digital ID Card**
   - Display QR code for gate entry
   - Show user profile information
   - Validity date display
   - Offline QR code access (cached)

3. **Profile View**
   - Name, ID, contact details
   - Current validity status
   - Notification settings

### For Guards:
1. **Simple Scanner Interface**
   - Built-in QR scanner using camera
   - Manual token input option
   - Traffic light feedback (green/red)
   - Instant validation results
   - Offline mode for recently validated codes

## Technology Stack

### React Native
- **Framework**: React Native (latest stable)
- **Navigation**: React Navigation
- **State Management**: React Context API / Redux
- **HTTP Client**: Axios
- **QR Generation**: react-native-qrcode-svg
- **QR Scanning**: react-native-camera or expo-camera
- **Storage**: AsyncStorage for offline data

### Platform Support
- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0+)

## Folder Structure

```
/app/mobile-app/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── components/       # Reusable components
│   │   ├── QRDisplay.js
│   │   ├── QRScanner.js
│   │   ├── IDCard.js
│   │   └── ...
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.js
│   │   ├── StudentPortalScreen.js
│   │   ├── FacultyPortalScreen.js
│   │   ├── GuardScannerScreen.js
│   │   └── ...
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.js
│   ├── services/         # API services
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/            # Utility functions
│   │   ├── storage.js
│   │   └── helpers.js
│   └── App.js            # Root component
├── package.json
└── README.md
```

## API Integration

### Base URL Configuration
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8001/api'  // Development
  : 'https://api.pictguard.com/api';  // Production
```

### Endpoints Used
- `POST /auth/user/login` - Student/Faculty login
- `POST /auth/guard/login` - Guard login
- `POST /validate-qr` - QR validation
- `GET /students` - Get student details (for profile refresh)
- `GET /faculty` - Get faculty details (for profile refresh)

## Key Features Implementation

### 1. QR Code Display
```javascript
import QRCode from 'react-native-qrcode-svg';

<QRCode
  value={userData.token}
  size={250}
  backgroundColor="white"
  color="black"
/>
```

### 2. QR Code Scanner
```javascript
import { RNCamera } from 'react-native-camera';

<RNCamera
  style={styles.camera}
  type={RNCamera.Constants.Type.back}
  onBarCodeRead={handleBarCodeRead}
  captureAudio={false}
/>
```

### 3. Offline Support
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store user data
await AsyncStorage.setItem('user_data', JSON.stringify(userData));

// Retrieve user data
const userData = JSON.parse(await AsyncStorage.getItem('user_data'));
```

## Development Setup

### Prerequisites
```bash
# Install Node.js, npm/yarn
# Install React Native CLI
npm install -g react-native-cli

# For iOS (macOS only)
brew install cocoapods
```

### Initialize Project
```bash
# Create new React Native project
cd /app
npx react-native init PICTGuardMobile
cd PICTGuardMobile

# Install dependencies
npm install axios react-navigation react-native-qrcode-svg react-native-camera
npm install @react-native-async-storage/async-storage

# For iOS
cd ios && pod install && cd ..
```

### Run on Device
```bash
# Android
npx react-native run-android

# iOS (macOS only)
npx react-native run-ios
```

## Design Guidelines

### Color Scheme (Same as Web)
- Primary: `#0F172A` (Slate 900)
- Secondary: `#F1F5F9` (Slate 100)
- Accent: `#0EA5E9` (Sky 500)
- Success: `#10B981` (Emerald 500)
- Error: `#EF4444` (Red 500)

### Typography
- Headings: Manrope (Bold)
- Body: Public Sans (Regular)
- Mono: JetBrains Mono (for IDs)

### UI Components
- Clean card-based design
- High contrast for outdoor visibility
- Large touch targets (min 44x44 pt)
- Bottom navigation for main screens
- Swipe gestures for natural interactions

## Offline Functionality

### Cached Data
1. **User Profile**: Cached after login
2. **QR Code**: Available offline once loaded
3. **Recent Validations**: Last 50 scans cached for guards

### Sync Strategy
- Auto-sync when network available
- Manual refresh option
- Conflict resolution: Server wins

## Security Considerations

1. **Secure Storage**: Use Keychain (iOS) and Keystore (Android)
2. **Token Encryption**: Encrypt auth tokens at rest
3. **Certificate Pinning**: Prevent MITM attacks
4. **Biometric Auth**: Touch ID / Face ID support
5. **Session Timeout**: Auto-logout after inactivity

## Notifications (Future Enhancement)

1. **Push Notifications**:
   - Pass expiry reminders
   - Event registration confirmations
   - System announcements

2. **Local Notifications**:
   - Daily reminders to check pass validity
   - Offline mode indicators

## Testing Strategy

### Unit Tests
- Service layer tests
- Utility function tests
- Component logic tests

### Integration Tests
- API integration tests
- Navigation flow tests
- Authentication flow tests

### E2E Tests
- Login to QR display flow
- QR scanning and validation flow
- Offline mode scenarios

## Deployment

### iOS
1. Configure App Store Connect
2. Generate certificates and provisioning profiles
3. Build and archive in Xcode
4. Upload to App Store
5. Submit for review

### Android
1. Generate signed APK/AAB
2. Configure Google Play Console
3. Upload release build
4. Submit for review

### OTA Updates
Use CodePush for instant updates without app store approval

## Future Enhancements

1. **Biometric Login**: Face ID / Touch ID
2. **Dark Mode**: System-aware theme switching
3. **Multi-language**: Support for regional languages
4. **Widget**: Home screen QR code widget
5. **Accessibility**: Screen reader support
6. **Analytics**: Usage tracking and insights

## Performance Optimization

1. **Image Optimization**: Use optimized images
2. **Code Splitting**: Load screens on demand
3. **Caching**: Aggressive caching for static data
4. **Network**: Request batching and debouncing
5. **Memory**: Proper cleanup and garbage collection

## Support

For mobile app development queries:
- Refer to React Native docs: https://reactnative.dev
- Backend API documentation: /app/README.md
- Contact: dev@pictguard.com

---

**Status**: Planning Phase
**Next Steps**: 
1. Initialize React Native project
2. Implement authentication screens
3. Develop QR display component
4. Build scanner interface
5. Add offline support
6. Testing and optimization
