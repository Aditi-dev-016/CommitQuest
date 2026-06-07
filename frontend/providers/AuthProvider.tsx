'use client';

import React, { createContext, useEffect, useState } from 'react';
import {
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, githubProvider, googleProvider } from '../lib/firebase';
import { AuthContextType, FirestoreUser } from '../types/auth';
import { userService } from '../services/firestore/user.service';
import { questService } from '../services/firestore/quest.service';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (fUser) => {
      setLoading(true);
      setError(null);
      if (fUser) {
        setFirebaseUser(fUser);
        const idToken = await fUser.getIdToken();
        setToken(idToken);
        document.cookie = `session_token=${idToken}; path=/; max-age=3600; SameSite=Lax; Secure`;

        try {
          let dbUser = await userService.getUser(fUser.uid);
          
          if (!dbUser) {
            // New user registration flow
            const githubProfile = fUser.providerData.find(
              (p) => p.providerId === 'github.com'
            );
            const githubUsername = githubProfile?.uid 
              ? (fUser as any).reloadUserInfo?.screenName || 'github_user' 
              : '';

            dbUser = await userService.createUser(fUser.uid, {
              email: fUser.email || '',
              displayName: fUser.displayName || 'Contributor',
              photoURL: fUser.photoURL || '',
              githubUsername: githubUsername,
            });

            // Assign starter achievements
            await userService.updateUser(fUser.uid, {
              achievements: ['first-steps']
            });

            // Assign starter quests
            const starterQuests = ['git-101', 'daily-check'];
            for (const qId of starterQuests) {
              await questService.startQuest(fUser.uid, qId);
            }

            // Redirect to onboarding
            router.push('/onboarding');
          }
          setUser(dbUser);
        } catch (err: any) {
          console.error('Error synchronizing user profile:', err);
          setError(err.message || 'Failed to sync user profile');
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
        document.cookie = `session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure`;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loginWithGithub = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err: any) {
      console.error('GitHub Sign-In Error:', err);
      setError(err.message || 'GitHub Login Failed');
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google Login Failed');
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err: any) {
      console.error('Sign-Out Error:', err);
      setError(err.message || 'Logout Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithGithub,
        loginWithGoogle,
        logout,
        token,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
