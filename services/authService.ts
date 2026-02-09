import {
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db as firestore } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
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
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await this.ensureUserProfile(user, email);
      return user;
    } catch (error) {
      const authError = error as AuthError;
      const errorCode = authError?.code || 'auth/invalid-credential';
      throw new Error(this.getErrorMessage(errorCode));
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
   * Ensure user profile exists in Firestore
   */
  private static async ensureUserProfile(user: User, emailOverride?: string): Promise<void> {
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const email = user.email || emailOverride || '';
        const userProfile: UserProfile = {
          uid: user.uid,
          email,
          displayName: user.displayName || email.split('@')[0] || 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, userProfile, { merge: true });
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
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
      'auth/user-not-found': 'Email or password is wrong.',
      'auth/wrong-password': 'Email or password is wrong.',
      'auth/invalid-credential': 'Email or password is wrong.',
      'auth/invalid-login-credentials': 'Email or password is wrong.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    };

    return errorMessages[code] || 'An error occurred. Please try again.';
  }
}

export default AuthService;
