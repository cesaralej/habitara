"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, provider } from "@/lib/firebase";

export function useFirebaseAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
        console.error("Authentication error:", error);
      } else {
        setError("An unexpected error occurred.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    handleGoogleLogin,
    clearError,
  };
}
