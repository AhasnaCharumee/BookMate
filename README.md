# 📚 BookMate - Book Management App

A beautiful, feature-rich book management application built with **React Native**, **Expo**, and **Firebase**. Manage your reading list, track your progress, and organize your books with an elegant dark-themed interface.

## ✨ Features

### 📖 Book Management
- **Add Books** - Easily add new books with title, author, and optional cover photos (front & back)
- **Edit Books** - Update book information, covers, and reading status anytime
- **Delete Books** - Remove books from your library
- **Book Details** - View comprehensive information about each book with cover images
- **Reading Status** - Track books as "To Read", "Reading", or "Completed"
- **Borrow/Lend Tracking** - Mark books as lent, track who borrowed, and expected return dates
- **Camera Integration** - Capture book cover photos using device camera

### 📸 Photo Management
- **Book Covers** - Add front and back cover photos to your books
- **Profile Photo** - Upload a profile picture from your gallery
- **Gallery Access** - Pick photos from device storage (iOS & Android)
- **Image Editing** - Crop and resize photos before saving

### 📊 Reading Statistics
- **Total Books Count** - See how many books you have
- **Reading Progress** - Track books currently being read
- **Completed Books** - View your reading achievements
- **To-Read List** - Keep track of your wishlist

### 🔐 Authentication
- **Email/Password Authentication** - Secure login and registration with email and password
- **Fast Login** - Optimized auth with immediate navigation and proper loader management
- **Auto Persistence** - User sessions are saved with AsyncStorage (Firebase + Custom)
- **Secure Logout** - One-tap logout with session cleanup

### 👤 User Profile
- **Profile Dashboard** - View your profile with customizable avatar
- **Avatar Selection** - Choose from 8 pre-made icon avatars (Book, Glasses, Person, Heart, Star, Planet, Rocket, Coffee)
- **Reading Statistics** - See your reading metrics at a glance
- **Account Management** - Manage your account settings
- **Secure Logout** - Easy logout button with confirmation

### 🎨 Modern UI/UX
- **Emerald Theme** - Sleek dark mode with emerald-teal accents (#10b981)
- **Responsive Design** - Optimized for all screen sizes
- **Smooth Navigation** - Intuitive routing with Expo Router and proper stack management
- **Loading States** - Beautiful loading indicators
- **Success Feedback** - Clear alerts with proper timing and callbacks
- **Bottom Tab Navigation** - Floating tab bar with 4 main screens (Home, Search, Library, Profile)
- **Icon System** - Cross-platform SF Symbols → Material Icons mapping
- **Genre Dropdown** - Modal-based genre selection with 16 predefined categories
- **Status Buttons** - Toggle buttons for reading status with improved contrast
- **Cover Photo Hierarchy** - Front cover (240px) prominently displayed, back cover (130px) secondary

## 🚀 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Managed React Native framework
- **TypeScript** - Type-safe code
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based routing with stack management
- **Expo Camera** - Native camera access for book covers
- **Expo Image Picker** - Gallery and photo selection

### Backend & Database
- **Firebase Authentication** - Secure user authentication with memory + AsyncStorage persistence
- **Firebase Firestore** - Real-time NoSQL database with subcollection structure
- **Firebase Storage** - Cloud storage for book cover images (future enhancement)
- **Firebase Storage** - Cloud file storage

### State Management
- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence
- **Custom Hooks** - Reusable logic

### UI & Navigation
- **Ionicons** - Beautiful icon library
- **Material Icons** - Cross-platform icon system
- **React Navigation** - Navigation library
- **Expo Router** - File-based routing with tabs and stack support
- **Custom Components** - Modular UI components (IconSymbol, IconButton)
- **Floating Tab Bar** - Custom positioned tab navigation with 30px offset from bottom

## 🤖 Android App
- Download APK: https://expo.dev/artifacts/eas/cqh25i4iVMARGgw4GWKzRM.apk

## 📋 Project Structure

```
bookMate/
├── app/
│   ├── (auth)/                 # Authentication screens group
│   │   ├── _layout.tsx        # Auth layout
│   │   ├── login.tsx          # Email/Password login screen
│   │   └── register.tsx       # Email/Password registration screen
│   ├── (dashboard)/           # Dashboard screens group
│   │   ├── _layout.tsx        # Dashboard layout with floating tab navigation
│   │   ├── home.tsx           # Book list screen with statistics
│   │   ├── search.tsx         # Book search screen
│   │   ├── library.tsx        # Filtered book library by status
│   │   ├── profile.tsx        # User profile with photo upload
│   │   └── books/             # Book management screens
│   │       ├── _layout.tsx    # Books layout
│   │       ├── add.tsx        # Add book with camera
│   │       ├── [id].tsx       # Book details screen
│   │       └── edit/[id].tsx  # Edit book with retake photos
│   ├── _layout.tsx            # Root layout
│   └── index.tsx              # App entry point (redirects based on auth)
├── services/
│   ├── firebase.ts            # Firebase configuration
│   ├── authService.ts         # Authentication logic
│   └── bookService.ts         # Book CRUD operations (subcollections)
├── contexts/
│   ├── AuthContext.tsx        # Auth state management
│   └── LoaderContext.tsx      # Loading state management
├── hooks/
│   ├── useAuth.ts             # Auth hook
│   ├── useLoader.ts           # Loader hook
│   └── use-color-scheme.ts    # Theme hook
├── components/
│   ├── LoadingScreen.tsx      # Loading component
│   ├── ui/
│   │   ├── icon-symbol.tsx    # SF Symbols → Material Icons mapping
│   │   ├── icon-button.tsx    # Reusable icon button component
│   │   └── collapsible.tsx    # Collapsible component
│   └── [other components]     # Camera view, parallax scroll, themed components
├── constants/
│   └── navigation.ts          # Navigation routes and styling config
└── package.json
```

## 📝 Recent Updates (February 2026)

### ✨ Major UI/UX Improvements
- **Genre Dropdown Component** - Replaced text input with beautiful modal selector featuring 16 predefined genres
- **Enhanced Status Buttons** - Improved visual contrast with outline style for inactive states
- **Cover Photo Sizing** - Implemented hierarchy with front cover (240px) and back cover (130px)
- **Required Fields Guide** - Added informative box explaining required fields on book forms
- **Header Improvements** - Centered titles with left-aligned back arrow for better navigation
- **Smart Tab Bar** - Bottom navigation automatically hides on book add/edit forms
- **Form Field Reset** - Forms now clear automatically after successful book addition
- **Auto-Refresh System** - Home and Library pages refresh when returning to screen using `useFocusEffect`
- **Borrow/Lend Flow** - Lend toggle on add/edit, badges in lists, and “Mark Returned” in details

### 🎨 Complete Theme Overhaul
- **Emerald/Teal Theme** - Changed from Indigo (#6366f1) to Emerald (#10b981) across entire app
- **12 Files Updated** - Comprehensive color update across all screens and components
- **Consistent Branding** - Unified color scheme throughout authentication, dashboard, and book management screens

### 👤 Profile Avatar System
- **Icon-Based Avatars** - Replaced photo upload with 8 pre-made icon options
- **Zero Storage Usage** - No Firebase Storage needed, icons rendered using Ionicons
- **Fast & Stable** - Instant selection with no upload delays or errors
- **Persistent Selection** - Avatar choice saved to Firestore and loads on login
- **Modal Selector** - Beautiful grid layout for choosing avatars with visual feedback

### 🐛 Bug Fixes
- **Firestore Undefined Values** - Fixed "unsupported field value" error by excluding undefined fields
- **Book Display Issues** - Fixed books not appearing after add by implementing redirect and refresh
- **Document Creation** - Fixed avatar update error by using `setDoc` with `merge:true`
- **Profile Icon Removal** - Removed redundant profile icon from home page header

## 🔧 Recent Fixes & Improvements (v1.1.0)

### ✅ Authentication & Navigation
- **Removed Audio Permission** - Cleared unused media library granular permissions to prevent Expo Go errors
- **Fixed Login Delay** - `hideLoader()` called immediately after successful login (no waiting for auth state)
- **Optimized Navigation** - Changed `router.push()` to `router.replace()` to remove pages from stack
- **Proper Error Handling** - Loader hidden in both success and error cases

### ✅ Book Management  
- **Fixed handleAddBook** - Removed setTimeout, alert shows immediately with proper callback
- **Home Page Thumbnails** - Book list displays cover images for visual identification
- **Enhanced Edit Screen** - Added camera integration to retake book cover photos
- **Cleaner Error Messages** - Better user feedback with simplified alerts

### ✅ User Interface
- **Fixed Camera Props** - Changed `autoFocus="on"` to `autofocus="on"` (correct naming)
- **Fixed Icon Names** - Changed `camera-off` to `camera-outline` (valid Ionicons)
- **Profile Photo Upload** - Users can add/update profile pictures from gallery using `expo-image-picker`
- **Improved Loading States** - Proper visibility to prevent modals blocking alerts

### ✅ Database Structure
- **Firestore Subcollections** - Updated to `users/{userId}/books/{bookId}` pattern
- **Security Rules Applied** - Proper Firestore rules for authenticated user access
- **Removed Redundant Checks** - Simplified book service methods with path-level security

### ✅ Navigation System (v1.2.0)
- **Bottom Tab Navigation** - Implemented floating tab bar with 4 main screens
- **Icon Mapping System** - Created SF Symbols → Material Icons cross-platform mapping
- **Icon Symbol Component** - Centralized icon component with 14+ icon mappings
- **Navigation Config** - Centralized navigation routes and styling constants
- **Icon Button Component** - Reusable icon button component for headers and actions
- **Tab Bar Styling** - Custom positioned tab bar (30px from bottom) with rounded corners and shadow
- **Dashboard Layout** - Converted from Stack to Tabs navigation for better UX

### 📱 Navigation Structure
```
📍 Bottom Tab Navigation (4 screens)
├── Home - Browse all books with covers and statistics
├── Search - Full-text search by title/author
├── Library - Filter books by reading status (All, Reading, Done, To Read)
└── Profile - User profile with photo, stats, and logout

📍 Hidden Screens (Stack navigation)
└── Books Management
    ├── /books/add - Add new book with camera
    ├── /books/[id] - View book details
    └── /books/edit/[id] - Edit book with photo retake
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android emulator or Expo Go app on physical device

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/AhasnaCharumee/BookMate.git
cd BookMate
```

2. **Install dependencies**
```bash
npm install
npm install expo-camera expo-image-picker
```

3. **Configure Firebase**
- Go to [Firebase Console](https://console.firebase.google.com)
- Select your project
- Update **Firestore Rules** (see below)

4. **Start development server**
```bash
npx expo start -c
```

5. **Run on device**
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Scan QR code with Expo Go app on physical device

### Firebase Security Rules

Navigate to **Firestore Database → Rules** and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/books/{bookId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish** to apply.

## � Building APK for Demonstration

### Method 1: EAS Build (Recommended)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo account**
```bash
eas login
```

3. **Configure EAS Build**
```bash
1```

4. **Build APK**
```bash
eas build --platform android --profile preview
```

5. **Download APK**
- After build completes, download the APK from the provided link
- Install on Android device for demonstration

### Method 2: Local Build (Development)

1. **Create development build**
```bash
npx expo run:android
```

2. **APK Location**
- APK will be generated in: `android/app/build/outputs/apk/`
- Copy the APK file for installation

### Testing the APK

1. Enable "Install from Unknown Sources" on Android device
2. Transfer APK to device via USB or email
3. Install and test all features
4. Ready for viva/presentation demonstration

## �🔑 Authentication

### Email/Password Sign-Up
1. Open the app
2. Click "Sign Up" on the login screen
3. Enter name, email, and password
4. Account is created and auto-saved to Firestore

### Email/Password Login
1. Open the app
2. Enter your email and password
3. Tap "Login" button
4. Auto-login on next app open (sessions are persisted)
---

## 📱 APK BUILD GUIDE (For Viva/Presentation)

### Quick Start (Copy-Paste Commands)

1. **Fix dependencies**
```powershell
npx expo install --fix
rmdir /s /q node_modules
npm install
```

2. **Login to Expo**
```powershell
eas login
```

3. **Build APK** 🔥
```powershell
eas build -p android --profile preview --clear-cache
```

4. **Download APK from terminal link** ✅

Your `eas.json` is already configured correctly with `"buildType": "apk"` for preview profile.

---
## 📱 Usage

### Adding a Book
1. Go to Home screen (My Books)
2. Tap the **+** button in bottom-right
3. Enter book title and author
4. Select reading status
5. Tap "Add Book"

### Managing Books
1. **View Details** - Tap on any book to see details
2. **Edit** - Tap pencil icon → modify info → save
3. **Delete** - Tap trash icon → confirm deletion

### Checking Statistics
1. Go to Profile screen
2. View your reading statistics
3. See total books, reading progress, and completed books

### Logging Out
1. Go to Profile screen
2. Tap red "Logout" button
3. Confirm logout
4. Redirected to login screen

## 🔐 Security

- ✅ Firebase Authentication for secure user login
- ✅ AsyncStorage with encrypted local persistence
- ✅ Firestore Security Rules for data access control
- ✅ User data isolated per account (uid-based)
- ✅ Password-based authentication with Firebase

## 📊 Database Schema

### users collection
```typescript
{
  uid: string
  email: string
  displayName: string
  avatar?: string  // Icon name (e.g., 'book-outline', 'glasses-outline')
  avatarUpdatedAt?: string
  createdAt: Date
  updatedAt: Date
}
```

### books collection
```typescript
{
  id: string
  userId: string
  title: string
  author: string
  genre?: string  // Selected from 16 predefined options
  status: 'reading' | 'completed' | 'to-read'
  frontCoverUrl?: string
  backCoverUrl?: string
  createdAt: string
  updatedAt: string
}
```

## 🎨 Theme

- **Background**: `#0f172a` (slate-950)
- **Primary**: `#10b981` (emerald-600) - Updated from indigo
- **Secondary**: `#1e293b` (slate-900)
- **Success**: `#22c55e` (green-500)
- **Info**: `#3b82f6` (blue-500)
- **Warning**: `#eab308` (yellow-400)
- **Danger**: `#ef4444` (red-500)

## 🚦 Available Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Lint code
npm run lint

# Reset project (clear cache)
npm run reset-project
```

## 📦 Dependencies

### Core
- `expo` - Managed React Native
- `expo-router` - File-based routing
- `react-native` - Native mobile framework
- `react` - UI library

### Authentication & Database
- `firebase` - Firebase SDK
- `@react-native-async-storage/async-storage` - Local storage

### Styling
- `nativewind` - Tailwind CSS for React Native
- `tailwindcss` - CSS framework

### UI Components
- `@expo/vector-icons` - Icon library
- `react-native-safe-area-context` - Safe area support

### Navigation
- `@react-navigation/native` - Navigation library
- `expo-linking` - Deep linking support

## 🤝 Contributing

This is a personal project, but feel free to fork and customize it for your own use!

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with details
3. Provide error messages and device info

## 🎯 Future Enhancements

- [x] ~~Book cover images~~ ✅ Implemented
- [x] ~~Genre selection~~ ✅ Implemented with 16-option dropdown
- [x] ~~Profile avatars~~ ✅ Icon-based system implemented
- [ ] Book ratings and reviews
- [ ] Reading progress tracking (page numbers)
- [ ] Search and advanced filter functionality
- [ ] Reading goals and challenges
- [ ] Social sharing features
- [ ] Reading statistics graphs
- [ ] Dark/Light theme toggle
- [ ] Book recommendations

## 👨‍💻 Author

Built with ❤️ by Ahasna

---

**Happy Reading! 📚**
