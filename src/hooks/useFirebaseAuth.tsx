"use client";

// useFirebaseAuth.js (new file)
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, provider } from "@/lib/firebase";
// import confetti from "canvas-confetti";

export function useFirebaseAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    isLoading,
    error,
    handleGoogleLogin,
    clearError: () => setError(null),
  };
}
