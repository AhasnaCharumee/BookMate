# Authentication & Context Setup

This document explains the authentication system and context setup for BookMate.

## 📋 Overview

The app uses Firebase Authentication combined with custom React Context providers to manage:

- **User Authentication** - Login, registration, and logout
- **Auth State Management** - Persisting user state across app restarts
- **Loading States** - Global loading indicator management
- **User Profiles** - Firestore-based user data storage

## 🏗️ Architecture

### Contexts

#### 1. AuthContext
Manages user authentication state and persistence.

**Location:** [`contexts/AuthContext.tsx`](../contexts/AuthContext.tsx)

**Features:**
- Tracks current user
- Persists user data to AsyncStorage
- Listens to Firebase auth state changes
- Provides logout functionality

**Usage:**
```typescript
import { useAuth } from '../hooks/useAuth';

export const MyComponent = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  return (
    <>
      {isAuthenticated && <Text>{user?.email}</Text>}
      <Button onPress={logout} title="Logout" />
    </>
  );
};
```

#### 2. LoaderContext
Manages global loading indicators.

**Location:** [`contexts/LoaderContext.tsx`](../contexts/LoaderContext.tsx)

**Features:**
- Show/hide global loader
- Manage loading state across the app

**Usage:**
```typescript
import { useLoader } from '../hooks/useLoader';

export const MyComponent = () => {
  const { showLoader, hideLoader, isLoading } = useLoader();
  
  const handleAction = async () => {
    showLoader();
    try {
      // Do something
    } finally {
      hideLoader();
    }
  };
  
  return <Button onPress={handleAction} title="Do Action" />;
};
```

### Hooks

#### useAuth
Access authentication context with type safety.

**Usage:**
```typescript
const { user, isAuthenticated, isLoading, logout } = useAuth();
```

**Returns:**
- `user: FirebaseUser | null` - Current user
- `isAuthenticated: boolean` - Whether user is logged in
- `isLoading: boolean` - Whether auth is still loading
- `logout: () => Promise<void>` - Logout function

#### useLoader
Access loader context with type safety.

**Usage:**
```typescript
const { isLoading, showLoader, hideLoader, setIsLoading } = useLoader();
```

**Returns:**
- `isLoading: boolean` - Current loading state
- `showLoader: () => void` - Show loader
- `hideLoader: () => void` - Hide loader
- `setIsLoading: (loading: boolean) => void` - Set loading state directly

### Services

#### AuthService
Handles all authentication-related operations.

**Location:** [`services/authService.ts`](../services/authService.ts)

**Methods:**

##### Registration
```typescript
import AuthService from '../services/authService';

const user = await AuthService.register(
  'user@example.com',
  'password123',
  'User Name'
);
```

##### Login
```typescript
const user = await AuthService.login('user@example.com', 'password123');
```

##### Logout
```typescript
await AuthService.logout();
```

##### Get User Profile
```typescript
const profile = await AuthService.getUserProfile(uid);
```

##### Update User Profile
```typescript
await AuthService.updateUserProfile(uid, {
  displayName: 'New Name',
  profilePicture: 'https://...'
});
```

##### Save Photo
```typescript
const photo = await AuthService.savePhoto(
  uid,
  photoUri,
  'Photo Title',
  'Photo description'
);
```

##### Get User Photos
```typescript
const photos = await AuthService.getUserPhotos(uid);
```

## 🔐 Firebase Setup

### Configuration

The app uses environment variables for Firebase configuration. Create a `.env` file based on `.env.example`:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Location:** [`config/firebaseConfig.ts`](../config/firebaseConfig.ts)

### Firestore Collections

The app creates the following Firestore collections:

#### Users Collection
```
users/
  {uid}/
    uid: string
    email: string
    displayName: string
    profilePicture?: string
    createdAt: Timestamp
    updatedAt: Timestamp
```

#### Photos Collection
```
photos/
  {docId}/
    uid: string (user's ID)
    photoUri: string (URL to stored photo)
    title: string
    description: string
    timestamp: Timestamp
```

### Security Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Photos can only be read/written by the owner
    match /photos/{docId} {
      allow read, write: if request.auth.uid == resource.data.uid;
      allow create: if request.auth.uid != null;
    }
  }
}
```

### Storage Bucket Rules

Recommended Cloud Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Photos directory - user can only access their own photos
    match /photos/{uid}/{allPaths=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

## 🔄 Complete Authentication Flow

### 1. App Initialization

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <AuthProvider>
      <LoaderProvider>
        <RootLayoutNav />
      </LoaderProvider>
    </AuthProvider>
  );
}
```

### 2. Check Auth Status

```typescript
function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      {isAuthenticated ? (
        <Stack.Screen name="home" />
      ) : (
        <Stack.Screen name="auth" />
      )}
    </Stack>
  );
}
```

### 3. User Login/Registration

```typescript
const handleLogin = async (email: string, password: string) => {
  const { showLoader, hideLoader } = useLoader();
  
  try {
    showLoader();
    const user = await AuthService.login(email, password);
    // User automatically logged in via AuthContext
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    hideLoader();
  }
};
```

### 4. Access Authenticated Content

```typescript
export const HomeScreen = () => {
  const { user, logout } = useAuth();
  
  return (
    <View>
      <Text>Welcome, {user?.email}!</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
};
```

## 📱 Common Use Cases

### Display User Info
```typescript
const { user } = useAuth();

return (
  <Text>{user?.email}</Text>
);
```

### Protect Routes
```typescript
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <LoginScreen />;
}

return <HomeScreen />;
```

### Handle Long Operations
```typescript
const { showLoader, hideLoader } = useLoader();

const handleSavePhoto = async (photoUri: string) => {
  showLoader();
  try {
    const photo = await AuthService.savePhoto(user!.uid, photoUri);
    Alert.alert('Success', 'Photo saved!');
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    hideLoader();
  }
};
```

## 🆘 Troubleshooting

### "useAuth must be used within an AuthProvider"
- Ensure `AuthProvider` wraps the component tree in `app/_layout.tsx`

### User not persisting across restarts
- Check that `@react-native-async-storage/async-storage` is installed
- Clear app cache and reinstall

### Firebase connection errors
- Verify `.env` file has correct credentials
- Check Firebase project has Auth and Firestore enabled
- Verify security rules allow operations

### Photos not saving
- Ensure `photoUri` is a valid file path
- Check Cloud Storage bucket rules
- Verify user is authenticated

## 📚 Resources

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Cloud Storage](https://firebase.google.com/docs/storage)
- [React Context API](https://react.dev/reference/react/useContext)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)

---

For more information, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
