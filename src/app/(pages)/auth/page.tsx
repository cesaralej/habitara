"use client";

import { TriangleAlert } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const Alert = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) => (
  <div className="flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-700 dark:bg-red-900/50 dark:text-red-300">
    <div className="flex items-center gap-2">
      <TriangleAlert className="h-4 w-4 shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
    <button onClick={onDismiss} className="text-xs font-medium underline">
      Dismiss
    </button>
  </div>
);

export default function AuthPage() {
  const { isLoading, error, handleGoogleLogin, clearError } = useFirebaseAuth();

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Join to start building better habits.
        </p>
        <div className="mt-6 space-y-4">
          {error && <Alert message={error} onDismiss={clearError} />}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></span>
            ) : (
              <img
                src="/google.svg"
                alt="Google logo"
                className="w-4 h-4 mr-2"
              />
            )}
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
