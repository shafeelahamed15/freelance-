'use client';

import { useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { FirestoreService, collections } from '@/lib/firestore';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let userDocUnsubscribe: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      // Clean up previous user document listener
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }
      
      if (firebaseUser) {
        try {
          let user = await FirestoreService.getById<User>(collections.users, firebaseUser.uid);
          
          if (!user) {
            const userData = {
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              brandSettings: {
                primaryColor: '#2563eb',
                secondaryColor: '#64748b',
                companyName: firebaseUser.displayName || firebaseUser.email!.split('@')[0] + ' Services',
              },
            };
            
            await FirestoreService.create(collections.users, userData, firebaseUser.uid);
            user = { id: firebaseUser.uid, ...userData } as User;
          }
          
          // Set up real-time listener for user document changes
          const userDocRef = doc(db, collections.users, firebaseUser.uid);
          userDocUnsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data() as Omit<User, 'id'>;
              const updatedUser: User = {
                id: doc.id,
                ...userData,
                createdAt: userData.createdAt || new Date(),
                updatedAt: userData.updatedAt || new Date(),
              };
              setAuthState({ user: updatedUser, loading: false, error: null });
            }
          }, (error) => {
            console.error('Error listening to user document:', error);
            setAuthState({ user, loading: false, error: null }); // Keep existing user data
          });
          
          setAuthState({ user, loading: false, error: null });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({ user: null, loading: false, error: 'Failed to fetch user data' });
        }
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      unsubscribe();
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData = {
        email,
        name,
        brandSettings: {
          primaryColor: '#2563eb',
          secondaryColor: '#64748b',
          companyName: name + ' Services',
        },
      };
      
      await FirestoreService.create(collections.users, userData, userCredential.user.uid);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = (updatedUserData: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updatedUserData } : null
    }));
  };

  return {
    ...authState,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
  };
}