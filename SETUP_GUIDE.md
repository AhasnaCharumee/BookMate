# 🚀 First Time Setup Guide

Follow these steps to get your BookMate app running locally.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Expo Go app (for testing on your phone)

## ⚙️ Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to **Project Settings** (gear icon)
4. Find the **Web** app configuration
5. Copy all these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

## 🔐 Step 2: Create `.env` File

1. Open your `.env` file in the project root
2. Replace the placeholder values with your real Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD... # Your real API key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=myproject
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012345
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012345:web:abcdef1234567890
```

**⚠️ IMPORTANT:** 
- `.env` is in `.gitignore` - it will NOT be committed
- Never share your `.env` file
- Keep it secure and local only

## 📱 Step 3: Install Dependencies

```bash
npm install
```

If you get vulnerability warnings, you can ignore them for development:
```bash
npm install --legacy-peer-deps
```

## 🔥 Step 4: Enable Firebase Services

In your [Firebase Console](https://console.firebase.google.com/):

### Authentication
- Go to **Authentication**
- Click **Get Started**
- Enable **Email/Password** sign-in method

### Firestore Database
- Go to **Firestore Database**
- Click **Create Database**
- Start in **Test Mode** (for development)
- Choose a region close to you

### Cloud Storage
- Go to **Storage**
- Click **Get Started**
- Use default settings
- Create bucket

## 🚀 Step 5: Run the App

### Start the Development Server
```bash
npm start
```

This will show a QR code in your terminal.

### Run on Your Device
- **Android**: Open Expo Go app → Scan QR code
- **iOS**: Open Camera app → Scan QR code → Open in Expo Go

### Run in Emulator/Simulator
```bash
npm start
# Then press:
# a - for Android emulator
# i - for iOS simulator
```

## 🧪 Step 6: Test the App

1. App should load without Firebase errors
2. You'll see the home screen
3. Try taking a photo with the camera button

## ✅ Verification Checklist

- [ ] Created `.env` file with real Firebase credentials
- [ ] Verified `.env` is NOT in git tracking (`git status` shows no .env)
- [ ] Installed all dependencies (`npm install` completed)
- [ ] Firebase Authentication is enabled
- [ ] Firestore Database is created
- [ ] Cloud Storage is created
- [ ] App starts without Firebase errors
- [ ] QR code scans successfully
- [ ] Camera permission works

## 🆘 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
**Solution:** Your `.env` file has invalid or incomplete Firebase credentials
- Double-check all values in `.env`
- Make sure you copied them exactly from Firebase Console
- Restart the dev server: `npm start`

### "Cannot find module '@react-native-async-storage/async-storage'"
**Solution:** Dependencies not installed
```bash
npm install
npm start
```

### Blank Screen or App Crashes
**Solution:** Clear cache and rebuild
```bash
npm start -c
# or
npx expo start --clear
```

### Camera Permission Issues
**Solution:** Grant permissions in the app
- The app will ask for camera permission on first use
- Tap "Grant Permission"
- If denied, check phone settings → Apps → BookMate → Permissions

### Android Emulator Issues
**Solution:** Use a different emulator or device
```bash
# List available devices
adb devices

# Run on specific device
expo start --android
```

## 📚 Next Steps

Once everything is running:

1. **Explore the code:**
   - [`app/index.tsx`](./app/index.tsx) - Main camera screen
   - [`contexts/`](./contexts/) - Authentication and loader contexts
   - [`services/authService.ts`](./services/authService.ts) - Firebase operations

2. **Read the documentation:**
   - [`AUTH_SETUP.md`](./AUTH_SETUP.md) - Authentication system
   - [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) - Firebase integration
   - [`SECURITY.md`](./SECURITY.md) - Security best practices

3. **Make changes and test:**
   - Edit files and see hot reload in action
   - Press `r` in terminal to reload
   - Press `m` to toggle menu

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Guide](https://reactnative.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [NativeWind](https://www.nativewind.dev/)

## 💡 Tips

- Use `expo start --clear` if you encounter any issues
- Check terminal logs for detailed error messages
- Press `j` to open debugger
- Use `shift+m` to access more tools

---

**You're all set!** 🎉 Happy coding!

For questions, check the documentation files or reach out to your team.
