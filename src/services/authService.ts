import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

export interface RegisterDto {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  termsAccepted: boolean;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export const authService = {
  /**
   * Monitor auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Register with Email & Password
   */
  async register(data: RegisterDto): Promise<UserProfile> {
    if (!data.password) {
      throw new Error('Password is required for registration.');
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || '',
      role: 'FARMER',
      termsAccepted: data.termsAccepted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
    }

    return userProfile;
  },

  /**
   * Login with Email & Password
   */
  async login(credentials: LoginDto): Promise<UserProfile> {
    if (!credentials.password) {
      throw new Error('Password is required for login.');
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    const user = userCredential.user;

    let profile = await this.getUserProfile(user.uid);
    if (!profile) {
      profile = {
        uid: user.uid,
        email: user.email || credentials.email,
        fullName: user.displayName || 'Farmer',
        role: 'FARMER',
        termsAccepted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), profile);
    }
    return profile;
  },

  /**
   * Login with Google Popup
   */
  async loginWithGoogle(): Promise<UserProfile | null> {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      let profile = await this.getUserProfile(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email || '',
          fullName: user.displayName || 'Farmer',
          role: 'FARMER',
          termsAccepted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(doc(db, 'users', user.uid), profile);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
        }
      }
      return profile;
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Fetch User Profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  },

  /**
   * Update User Profile
   */
  async updateUserProfile(
    uid: string,
    updates: Partial<Pick<UserProfile, 'fullName' | 'phoneNumber'>>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },
};
