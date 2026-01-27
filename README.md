# 📸 BookMate - Camera App

A modern, feature-rich camera application built with React Native and Expo, featuring photo capture, gallery integration, and a beautiful dark theme UI. Powered by Firebase for authentication and data storage.

## ✨ Features

### 📷 Camera Functionality
- **Photo Capture** - High-quality photo capture with customizable quality settings
- **Camera Toggle** - Seamlessly switch between front and back cameras
- **Live Preview** - Real-time camera preview with smooth performance
- **Photo Preview** - View captured photos before saving

### 💾 Gallery Integration
- **Auto Save** - Automatically save captured photos to device gallery
- **Permission Handling** - Smart permission requests for camera and media library
- **Success Feedback** - User-friendly alerts for save confirmations

### 🎨 Modern UI/UX
- **Dark Theme** - Sleek dark mode interface with indigo accent colors
- **Smooth Animations** - Polished transitions and interactions
- **Intuitive Controls** - Easy-to-use camera controls and navigation
- **Permission Screens** - Beautiful permission request screens with clear explanations

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) ~54.0.31
- **Language:** [TypeScript](https://www.typescriptlang.org/) ~5.9.2
- **UI Library:** [React Native](https://reactnative.dev/) 0.81.5
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) ~6.0.21
- **Styling:** [NativeWind](https://www.nativewind.dev/) ^4.2.1 (Tailwind CSS for React Native)
- **Icons:** [@expo/vector-icons](https://icons.expo.fyi/) ^15.0.3
- **Camera:** [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) ~17.0.10
- **Media Library:** [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) ~18.2.1
- **Backend:** [Firebase](https://firebase.google.com/) - Authentication, Firestore, Storage

## 📦 Dependencies

```json
{
  "expo": "~54.0.31",
  "expo-camera": "~17.0.10",
  "expo-media-library": "~18.2.1",
  "expo-router": "~6.0.21",
  "nativewind": "^4.2.1",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "typescript": "~5.9.2",
  "firebase": "^9.x.x",
  "@react-native-firebase/app": "^18.x.x",
  "@react-native-firebase/auth": "^18.x.x",
  "@react-native-firebase/firestore": "^18.x.x",
  "@react-native-firebase/storage": "^18.x.x"
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Firebase account
- Expo Go app (for testing)

### Setup (5 minutes)

1. **Clone and install:**
   ```bash
   git clone https://github.com/AhasnaCharumee/BookMate.git
   cd BookMate
   npm install
   ```

2. **Configure Firebase:**
   - Get credentials from [Firebase Console](https://console.firebase.google.com/)
   - Update `.env` file with your values
   - See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps

3. **Run the app:**
   ```bash
   npm start
   # Scan QR code with Expo Go or Camera app
   ```

📖 **[Complete Setup Guide →](./SETUP_GUIDE.md)**

## 📚 Documentation

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project to initial state

## 🔒 Firebase Integration

BookMate uses Firebase for:

- **Authentication** - Secure user login and registration (with persistent sessions)
- **Firestore** - Cloud database for storing user profiles and photos
- **Storage** - Cloud storage for photo files
- **Security Rules** - Encrypted data access and privacy

### Security ⚠️
- API keys are **never hardcoded** - stored in `.env` file
- `.env` file is **not committed** to git
- All sensitive files are in `.gitignore`
- See [SECURITY.md](./SECURITY.md) for details

## 📂 Project Structure

```
BookMate/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Camera screen
├── components/            # Reusable React components
│   ├── LoadingScreen.tsx
│   ├── camera-view.tsx
│   └── ui/
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── LoaderContext.tsx  # Loading state
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   └── useLoader.ts
├── services/              # Business logic
│   └── authService.ts     # Firebase operations
├── config/                # Configuration files
│   └── firebaseConfig.ts  # Firebase setup
├── constants/             # App constants
├── .env.example           # Environment variables template
├── SETUP_GUIDE.md         # First-time setup
└── README.md              # This file
```

## 🔄 Architecture

### State Management
- **AuthContext** - Manages user authentication state
- **LoaderContext** - Manages global loading indicators
- **AsyncStorage** - Persists auth state across sessions

### Services
- **AuthService** - Firebase authentication operations
- **Firestore** - User profiles and photo metadata
- **Cloud Storage** - Photo file storage

## ✅ Verification

To verify everything is set up correctly:

```bash
# Check environment
node -v  # Should be v16+
npm -v

# Check dependencies
npm list

# Run linter
npm run lint

# Start dev server
npm start
```

## 🎨 Design System

- **Primary Color:** Indigo (600, 500, 400)
- **Background:** Slate (950, 900, 800)
- **Text:** White with slate variations
- **Accent:** Indigo with shadow effects
- **UI Style:** Modern, minimalist, dark theme

## 🆘 Troubleshooting

**"Firebase: Error (auth/invalid-api-key)"**
- Update `.env` with real Firebase credentials
- Restart dev server: `npm start`

**"Cannot find module"**
- Run `npm install` and restart

**"Blank screen"**
- Clear cache: `npm start -c`

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting) for more help.

## �📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Author

**Ahasna Charumee**
- GitHub: [@AhasnaCharumee](https://github.com/AhasnaCharumee)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Styled with [NativeWind](https://www.nativewind.dev/)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)
- Backend powered by [Firebase](https://firebase.google.com/)

---

Made with ❤️ by Ahasna Charumee

**[→ Get Started Now](./SETUP_GUIDE.md)**
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)

---

Made with ❤️ by Ahasna Charumee
