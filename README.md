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

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AhasnaCharumee/BookMate.git
   cd BookMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

5. **Firebase Setup (Optional)**
   - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase integration instructions
   - Download `google-services.json` from Firebase Console
   - Add Firebase credentials to `.env` file

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project to initial state

## 🏗️ Project Structure

```
bookMate/
├── app/
│   ├── _layout.tsx       # Root layout with navigation setup
│   └── index.tsx         # Main camera screen
├── components/
│   ├── camera-view.tsx   # Camera component
│   └── ui/               # Reusable UI components
├── constants/
│   └── theme.ts          # Theme colors and constants
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── assets/
│   └── images/           # App images and icons
├── global.css            # Global Tailwind styles
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Key Features Implementation

### Camera Permissions
- Graceful permission handling with user-friendly UI
- Clear explanation of why permissions are needed
- Easy-to-use grant permission buttons

### Photo Capture
- High-quality photo capture (0.8 quality setting)
- Instant photo preview after capture
- Automatic save to device gallery

### Camera Controls
- Toggle between front and back cameras
- Close camera view
- Capture photo button with visual feedback

## 🎨 Design System

- **Primary Color:** Indigo (600, 500, 400)
- **Background:** Slate (950, 900, 800)
- **Text:** White with slate variations
- **Accent:** Indigo with shadow effects
- **UI Style:** Modern, minimalist, dark theme

## � Firebase Integration

BookMate uses Firebase for:

- **Authentication** - Secure user login and registration
- **Firestore** - Cloud database for storing photos and metadata
- **Storage** - Cloud storage for photo files
- **Security Rules** - Protected data access and privacy

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## �📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Author

**Ahasna Charumee**
- GitHub: [@AhasnaCharumee](https://github.com/AhasnaCharumee)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Styled with [NativeWind](https://www.nativewind.dev/)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)

---

Made with ❤️ by Ahasna Charumee
