# GymStat iOS App Store Deployment Guide

## Prerequisites
1. **Mac computer** (required for iOS development)
2. **Xcode** (latest version from Mac App Store)
3. **Apple Developer Account** ($99/year)
4. **Node.js** and **npm** (already installed)

## Step 1: Install Capacitor Dependencies
```bash
npm install
```

## Step 2: Initialize Capacitor
```bash
npx cap init "GymStat" "com.gymstat.app"
```

## Step 3: Add iOS Platform
```bash
npx cap add ios
```

## Step 4: Build and Sync
```bash
npm run build:ios
```

## Step 5: Configure iOS Project in Xcode

### App Icons & Launch Screen
1. In Xcode, select your project in the navigator
2. Go to "Images.xcassets" → "AppIcon"
3. Add app icons in all required sizes:
   - 20x20, 29x29, 40x40, 58x58, 60x60, 80x80, 87x87, 120x120, 180x180
   - Use a tool like [App Icon Generator](https://appicon.co/) to create all sizes

### App Information
1. Select your target → "General" tab
2. Set:
   - **Display Name**: GymStat
   - **Bundle Identifier**: com.gymstat.app
   - **Version**: 1.0.0
   - **Build**: 1
   - **Deployment Target**: iOS 13.0 or higher

### Capabilities & Permissions
1. Go to "Signing & Capabilities"
2. Add your Apple Developer Team
3. Enable automatic signing

### Privacy Permissions (Info.plist)
Add these if your app needs them:
```xml
<key>NSCameraUsageDescription</key>
<string>GymStat uses camera to scan workout QR codes</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>GymStat accesses photos to save workout progress images</string>
```

## Step 6: Test on Device
1. Connect your iPhone via USB
2. Select your device in Xcode
3. Click "Build and Run" (▶️)
4. Trust the developer certificate on your device

## Step 7: Prepare for App Store

### App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app:
   - **Platform**: iOS
   - **Name**: GymStat
   - **Bundle ID**: com.gymstat.app
   - **SKU**: gymstat-ios
   - **Language**: English

### App Metadata
- **App Description**: Professional workout tracking app with intelligent progress analytics
- **Keywords**: fitness, workout, gym, tracking, exercise, strength training
- **Category**: Health & Fitness
- **Age Rating**: 4+ (suitable for all ages)

### Screenshots Required
Create screenshots for:
- iPhone 6.7" (iPhone 14 Pro Max)
- iPhone 6.5" (iPhone 14 Plus)
- iPhone 5.5" (iPhone 8 Plus)
- iPad Pro 12.9" (if supporting iPad)

### App Review Information
- **Demo Account**: Not required (app works offline)
- **Review Notes**: "GymStat is a workout tracking app that stores data locally on device"

## Step 8: Archive and Upload

### Create Archive
1. In Xcode, select "Any iOS Device" as target
2. Product → Archive
3. Wait for build to complete

### Upload to App Store
1. In Organizer window, select your archive
2. Click "Distribute App"
3. Choose "App Store Connect"
4. Follow the upload wizard

### Submit for Review
1. In App Store Connect, go to your app
2. Select the build you uploaded
3. Fill in all required metadata
4. Submit for review

## Step 9: App Store Review Process
- **Review Time**: 1-7 days typically
- **Common Rejections**: Missing metadata, crashes, guideline violations
- **Approval**: App goes live automatically or manually

## Additional Tips

### App Store Guidelines Compliance
- ✅ Your app stores data locally (good for privacy)
- ✅ Provides clear value to users
- ✅ No in-app purchases initially (simpler approval)
- ✅ Professional UI/UX design

### Marketing Assets
- App icon (1024x1024 PNG)
- App preview video (optional but recommended)
- Marketing website
- Privacy policy (recommended)

### Version Updates
For future updates:
1. Increment version number in Xcode
2. Build and archive new version
3. Upload to App Store Connect
4. Submit update for review

## Troubleshooting

### Common Issues
- **Build Errors**: Clean build folder (Cmd+Shift+K)
- **Signing Issues**: Check Apple Developer account status
- **Capacitor Sync Issues**: Delete ios folder and re-add platform

### Support Resources
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Cost Breakdown
- **Apple Developer Account**: $99/year
- **Development**: Free (you already have the app)
- **App Store Fee**: 30% of revenue (if you add paid features later)

Your app is ready for the App Store! The offline-first design and professional UI make it a strong candidate for approval.