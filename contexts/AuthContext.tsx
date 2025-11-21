import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    activeGoal: any | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
    activateGoal: (plan: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [activeGoal, setActiveGoal] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch User Profile
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data() as UserProfile);
                } else {
                    // Create initial profile if not exists (fallback)
                    const newProfile: UserProfile = {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName || 'User',
                        email: currentUser.email || '',
                        age: '',
                        occupation: '',
                        onboardingCompleted: false
                    };
                    await setDoc(docRef, newProfile);
                    setUserProfile(newProfile);
                }

                // Fetch Active Goal
                const goalRef = doc(db, "users", currentUser.uid, "goals", "active");
                const goalSnap = await getDoc(goalRef);
                if (goalSnap.exists()) {
                    setActiveGoal(goalSnap.data());
                } else {
                    setActiveGoal(null);
                }

            } else {
                setUserProfile(null);
                setActiveGoal(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserProfile(null); // Clear profile on logout
            setActiveGoal(null); // Clear active goal on logout
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid);
            await setDoc(docRef, data, { merge: true });
            // Update local state
            setUserProfile(prev => prev ? { ...prev, ...data } : null);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    const activateGoal = async (plan: any) => {
        if (!user) return;
        try {
            const goalRef = doc(db, "users", user.uid, "goals", "active");
            // Add timestamp and initial progress
            const goalData = {
                ...plan,
                activatedAt: new Date().toISOString(),
                progress: 0,
                nextTask: plan.milestones[0]?.tasks[0]?.title || "Start Journey"
            };
            await setDoc(goalRef, goalData);
            setActiveGoal(goalData);
        } catch (error) {
            console.error("Error activating goal", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, activeGoal, loading, signInWithGoogle, logout, updateUserProfile, activateGoal }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
