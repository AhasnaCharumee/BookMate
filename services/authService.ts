import {
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db as firestore } from './firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id: string;
  uid: string;
  photoUri: string;
  timestamp: Date;
  title?: string;
  description?: string;
}

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(firestore, 'users', user.uid), userProfile);

      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Login with Google
   */
  static async loginWithGoogle(): Promise<User> {
    try {
      // Initialize Google Sign-In
      GoogleSignin.configure({
        webClientId: '555256137272-6f8kl5c7v2m8h4j6n9p3q5r7t9u1v3w5.apps.googleusercontent.com',
        offlineAccess: true,
      });

      // Check if user is already signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (!isSignedIn) {
        await GoogleSignin.signIn();
      }

      // Get the ID token
      const tokens = await GoogleSignin.getTokens();
      const credential = GoogleAuthProvider.credential(tokens.idToken);

      // Sign in with Firebase
      const { user } = await signInWithCredential(auth, credential);

      // Check if user profile exists, if not create it
      const userProfile = await this.getUserProfile(user.uid);
      if (!userProfile) {
        const newUserProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Google User',
          profilePicture: user.photoURL || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(firestore, 'users', user.uid), newUserProfile);
      }

      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(
        authError.code 
          ? this.getErrorMessage(authError.code)
          : 'Google sign-in failed. Please try again.'
      );
    }
  }

  /**
   * Logout from Google
   */
  static async logoutGoogle(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Logout the current user
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userRef = doc(firestore, 'users', uid);
      await setDoc(
        userRef,
        {
          ...updates,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Save a photo to Firestore
   */
  static async savePhoto(
    uid: string,
    photoUri: string,
    title?: string,
    description?: string
  ): Promise<Photo> {
    try {
      const photosCollection = collection(firestore, 'photos');
      const docRef = await addDoc(photosCollection, {
        uid,
        photoUri,
        title: title || 'Untitled Photo',
        description: description || '',
        timestamp: new Date(),
      });

      return {
        id: docRef.id,
        uid,
        photoUri,
        title: title || 'Untitled Photo',
        description: description || '',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  }

  /**
   * Get all photos for a user
   */
  static async getUserPhotos(uid: string): Promise<Photo[]> {
    try {
      const photosCollection = collection(firestore, 'photos');
      const q = query(photosCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      } as Photo));
    } catch (error) {
      console.error('Error getting user photos:', error);
      return [];
    }
  }

  /**
   * Map Firebase auth error codes to user-friendly messages
   */
  private static getErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed. Please try again.',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'Email not found. Please sign up first.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    };

    return errorMessages[code] || 'An error occurred. Please try again.';
  }
}

export default AuthService;
