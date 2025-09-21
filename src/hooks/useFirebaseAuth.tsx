"use client";

// useFirebaseAuth.js (new file)
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, provider } from "@/lib/firebase";
// import confetti from "canvas-confetti";

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, provider);
      // Trigger confetti after successful login
      //   confetti({ particleCount: 500, spread: 130, origin: { y: 0.6 } });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message); // This is now safe
        console.error("Authentication error:", error);
      } else {
        // Handle other, unexpected error types
        setError("An unexpected error occurred.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const clearError = () => setError(null);

  return {
    user,
    isLoading,
    error,
    handleGoogleLogin,
    clearError,
  };
}
