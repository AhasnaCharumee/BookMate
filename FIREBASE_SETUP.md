# Firebase Setup Guide for BookMate

This guide explains how to integrate Firebase with your Expo-based BookMate app.

## 📋 Prerequisites

- Expo project (already set up ✓)
- Firebase account at [firebase.google.com](https://firebase.google.com)
- `google-services.json` file (for Android)
- `GoogleService-Info.plist` file (for iOS)

## 🚀 Installation Steps

### 1. Install Firebase SDK

For Expo projects, install the modular Firebase SDK:

```bash
npm install firebase
```

Or using yarn:

```bash
yarn add firebase
```

### 2. Add Firebase Config Files

#### Android Setup

1. Download `google-services.json` from Firebase Console
2. Copy it to your project root: `./google-services.json`
3. Update `app.json` to include the Google Services plugin:

```json
{
  "expo": {
    "name": "bookmate",
    "plugins": [
      [
        "@react-native-firebase/app"
      ]
    ]
  }
}
```

#### iOS Setup

1. Download `GoogleService-Info.plist` from Firebase Console
2. In EAS Build, iOS builds will automatically use the config

### 3. Install React Native Firebase Modules

For the best experience with Expo, install React Native Firebase:

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

Or install only the modules you need:

```bash
# Authentication
npm install @react-native-firebase/auth

# Cloud Firestore
npm install @react-native-firebase/firestore

# Realtime Database
npm install @react-native-firebase/database

# Storage
npm install @react-native-firebase/storage
```

### 4. Configure Plugins in app.json

Update your `app.json` file:

```json
{
  "expo": {
    "name": "bookmate",
    "slug": "bookmate",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "plugins": [
      [
        "@react-native-firebase/app",
        {
          "android": {
            "googleServicesFile": "./google-services.json"
          },
          "ios": {
            "googleServicesFile": "./GoogleService-Info.plist"
          }
        }
      ]
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 5. Rebuild with EAS

```bash
eas build --platform android
# or
eas build --platform ios
# or
eas build --platform all
```

## 📱 Firebase Configuration Example

Create a `firebaseConfig.ts` file:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

## 🔐 Firebase Authentication Setup

### Add Firebase Auth to Your App

```typescript
import { auth } from './firebaseConfig';
import { signInAnonymously, signOut } from 'firebase/auth';

// Sign in anonymously (for quick testing)
const signInAnon = async () => {
  try {
    await signInAnonymously(auth);
    console.log('Signed in anonymously');
  } catch (error) {
    console.error('Auth error:', error);
  }
};

// Sign out
const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log('Signed out');
  } catch (error) {
    console.error('Sign out error:', error);
  }
};
```

## 💾 Firestore Database Setup

### Create a Collection Reference

```typescript
import { firestore } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Add a document to a collection
const addPhoto = async (photoData: any) => {
  try {
    const docRef = await addDoc(collection(firestore, 'photos'), {
      ...photoData,
      timestamp: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

// Get all documents from a collection
const getPhotos = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'photos'));
    const photos: any[] = [];
    querySnapshot.forEach((doc) => {
      photos.push({ id: doc.id, ...doc.data() });
    });
    return photos;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};
```

## 📸 Store Photos in Firebase Storage

```typescript
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadPhotoToFirebase = async (photoUri: string, fileName: string) => {
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `photos/${fileName}`);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File available at', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Upload error: ', error);
  }
};
```

## ⚙️ Environment Variables

Create a `.env` file for your Firebase config (for security):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then update `firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

## ✅ Checklist

- [ ] Firebase project created
- [ ] `google-services.json` downloaded
- [ ] Firebase SDK installed (`npm install firebase`)
- [ ] React Native Firebase plugins installed
- [ ] `app.json` updated with plugins
- [ ] `firebaseConfig.ts` created
- [ ] Environment variables set up
- [ ] EAS build configured
- [ ] Authentication implemented
- [ ] Firestore setup tested

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Guide](https://rnfirebase.io/)
- [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [Firebase Console](https://console.firebase.google.com/)

## 🆘 Troubleshooting

### Build fails with "google-services.json not found"
- Ensure `google-services.json` is in your project root
- Add it to `app.json` under plugins

### Firebase not initializing
- Check that all environment variables are set correctly
- Verify Firebase config values in console
- Clear cache: `expo start -c`

### Authentication issues
- Ensure Firebase Auth is enabled in Firebase Console
- Check security rules in Firestore/Database

---

For more help, visit the [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
