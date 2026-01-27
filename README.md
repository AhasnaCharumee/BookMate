# 📚 BookMate - Book Management App

A beautiful, feature-rich book management application built with **React Native**, **Expo**, and **Firebase**. Manage your reading list, track your progress, and organize your books with an elegant dark-themed interface.

## ✨ Features

### 📖 Book Management
- **Add Books** - Easily add new books to your collection with title and author
- **Edit Books** - Update book information anytime
- **Delete Books** - Remove books from your library
- **Book Details** - View comprehensive information about each book
- **Reading Status** - Track books as "To Read", "Reading", or "Completed"

### 📊 Reading Statistics
- **Total Books Count** - See how many books you have
- **Reading Progress** - Track books currently being read
- **Completed Books** - View your reading achievements
- **To-Read List** - Keep track of your wishlist

### 🔐 Authentication
- **Email/Password Login** - Secure authentication with email and password
- **Google Sign-In** - Quick sign-in with your Google account
- **Auto Persistence** - User sessions are saved locally with AsyncStorage
- **Secure Logout** - One-tap logout with session cleanup

### 👤 User Profile
- **Profile Dashboard** - View your profile information
- **Reading Statistics** - See your reading metrics at a glance
- **Account Management** - Manage your account settings
- **Secure Logout** - Easy logout button with confirmation

### 🎨 Modern UI/UX
- **Dark Theme** - Sleek dark mode with indigo accents
- **Responsive Design** - Optimized for all screen sizes
- **Smooth Navigation** - Intuitive routing with Expo Router
- **Loading States** - Beautiful loading indicators
- **Success Feedback** - Clear alerts and confirmations

## 🚀 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Managed React Native framework
- **TypeScript** - Type-safe code
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based routing

### Backend & Database
- **Firebase Authentication** - Secure user authentication
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Storage** - Cloud file storage

### State Management
- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence
- **Custom Hooks** - Reusable logic

### UI & Navigation
- **Ionicons** - Beautiful icon library
- **React Navigation** - Navigation library
- **Custom Components** - Modular UI components

## 📋 Project Structure

```
bookMate/
├── app/
│   ├── (auth)/                 # Authentication screens group
│   │   ├── _layout.tsx        # Auth layout
│   │   ├── login.tsx          # Login screen with Google Sign-In
│   │   └── register.tsx       # Registration screen
│   ├── (dashboard)/           # Dashboard screens group
│   │   ├── _layout.tsx        # Dashboard layout
│   │   ├── home.tsx           # Book list screen
│   │   ├── profile.tsx        # User profile screen
│   │   └── books/             # Book management screens
│   │       ├── _layout.tsx    # Books layout
│   │       ├── add.tsx        # Add book screen
│   │       ├── [id].tsx       # Book details screen
│   │       └── edit/[id].tsx  # Edit book screen
│   ├── _layout.tsx            # Root layout
│   └── index.tsx              # App entry point (redirects based on auth)
├── services/
│   ├── firebase.ts            # Firebase configuration
│   ├── authService.ts         # Authentication logic
│   └── bookService.ts         # Book CRUD operations
├── contexts/
│   ├── AuthContext.tsx        # Auth state management
│   └── LoaderContext.tsx      # Loading state management
├── hooks/
│   ├── useAuth.ts             # Auth hook
│   ├── useLoader.ts           # Loader hook
│   └── use-color-scheme.ts    # Theme hook
├── components/
│   ├── LoadingScreen.tsx      # Loading component
│   └── BottomNav.tsx          # Bottom navigation
└── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/AhasnaCharumee/BookMate.git
cd bookMate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
- The app uses Firebase project `book-52c43`
- Firebase credentials are already configured in `services/firebase.ts`
- No additional setup needed for Firebase

4. **Start the development server**
```bash
npm start
# or
npx expo start
```

5. **Run on device/emulator**
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Scan QR code with Expo Go app

## 🔑 Authentication

### Email/Password Sign-Up
1. Open the app
2. Click "Sign Up" on the login screen
3. Enter name, email, and password
4. Account is created and auto-saved to Firestore

### Google Sign-In
1. Open the app
2. Click "Sign in with Google" button
3. Select your Google account
4. Auto-login on next app open (sessions are persisted)

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
- ✅ Google credentials securely configured
- ✅ User data isolated per account (uid-based)

## 📊 Database Schema

### users collection
```typescript
{
  uid: string
  email: string
  displayName: string
  profilePicture?: string
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
  status: 'reading' | 'completed' | 'to-read'
  createdAt: string
  updatedAt: string
}
```

## 🎨 Theme

- **Background**: `#0f172a` (slate-950)
- **Primary**: `#6366f1` (indigo-600)
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
- `@react-native-google-signin/google-signin` - Google authentication
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

- [ ] Book ratings and reviews
- [ ] Reading progress tracking
- [ ] Book cover images
- [ ] Search and filter functionality
- [ ] Reading goals and challenges
- [ ] Social sharing features
- [ ] Reading statistics graphs
- [ ] Dark/Light theme toggle

## 👨‍💻 Author

Built with ❤️ by Ahasna

---

**Happy Reading! 📚**
